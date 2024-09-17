//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
//Local files
import { sendSuccess } from '@utils/send-success';
import _ from 'lodash';
import { UserRecruitmentFavoriteRepository } from '@repositories/user-recruitment-favorite.repository';
import { InterestInforDto } from '../dto/candidate-interest.dto';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { CandidateInterestRepository } from '@repositories/candidate-interest.repository';
import { CandidateInterestCareerRepository } from '@repositories/candidate-interest-career.repository';
import { UserRepository } from '@repositories/user.repository';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateInterest } from '@models/candidate-interest.model';
import { CandidateInterestCareer } from '@models/candidate-interest-career.model';
import { DFDegree } from '@models/df-degree.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { Position } from '@models/position.model';
import { SalaryRange } from '@models/salary-range.model';
import { DFCareer } from '@models/df-career.model';
import { WalletRepository } from '@repositories/wallet.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { DFProvince } from '@models/df-province.model';
import { SearchingData } from '@models/searching-data.model';
import { saveSearchingDataFromInterest } from '@utils/save-searching';
import { CandidateProvince } from '@models/candidate-province.model';

@Injectable()
export class CandidateInterestService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly candidateInterestRepository: CandidateInterestRepository,
    private readonly candidateInterestCareerRepository: CandidateInterestCareerRepository,
    private readonly userRecruitmentFavorite: UserRecruitmentFavoriteRepository,
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
  ) {}

  async createInterestInformations(dto: InterestInforDto) {
    const foundCandidateInformation =
      await this.candidateInformationRepository.findOne({
        where: {
          id: dto.candidate_information_id,
        },
      });

    if (!foundCandidateInformation) {
      throw new HttpException(
        'Thông tin ứng viên/cộng tác viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          //Tạo bằng cấp cao nhất, số năm kinh nghiệm , vị trí chức vụ mong muốn, mức lương mong muốn của ứng viên/cộng tác viên
          const payloadCreate = {
            candidate_information_id: dto.candidate_information_id,
            df_degree_id: dto.degree_id,
            year_of_experience_id: dto.year_of_experience_id,
            position_id: dto.position_id,
            salary_range_id: dto.salary_range_id,
          };
          const candidateInterest =
            await this.candidateInterestRepository.create(payloadCreate, {
              transaction,
            });
          //Tạo nghề nghiệp quan tâm
          if (dto.career_ids && dto.career_ids.length > 0) {
            const careerListCreated = dto.career_ids.map((e: any) => ({
              candidate_interest_id: candidateInterest?.id,
              df_career_id: e,
            }));
            await this.candidateInterestCareerRepository.bulkCreate(
              careerListCreated,
              { transaction },
            );
          }
          // Cập nhật số năm kinh nghiệm, mức lương và bằng cấp(candidate information)
          await this.candidateInformationRepository.update(
            {
              salary_range_id: dto.salary_range_id,
              years_of_experience_id: dto.year_of_experience_id,
              degree_id: dto.degree_id,
            },
            {
              where: {
                id: dto.candidate_information_id,
              },
              transaction,
            },
          );

          return { candidateInterest };
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể tạo thông tin ứng viên/cộng tác viên quan tâm lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    //Lưu thông tin data quan tâm vào thông tin lưu bộ lọc
    const foundCandidateProvinces = await CandidateProvince.findAll({
      where: {
        candidate_information_id: foundCandidateInformation.id,
      },
    }); //Tìm thông tin tỉnh thành đã lưu trước đó chưa?

    await saveSearchingDataFromInterest(
      foundCandidateInformation.user_id,
      {
        province_ids: foundCandidateProvinces.map((elm) => elm.df_province_id),
        career_ids: dto.career_ids,
        years_of_experience_ids: dto.year_of_experience_id,
        salary_range_ids: dto.salary_range_id,
        position_ids: dto.position_id,
      },
      foundCandidateInformation.id,
    );

    return sendSuccess({
      data: result,
      msg: 'Tạo thông tin quan tâm thành công',
    });
  }

  async getCandidateInterest(user_id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: [
            {
              model: CandidateInterest,
              include: [
                {
                  model: DFDegree,
                },
                {
                  model: YearOfExperience,
                },
                {
                  model: Position,
                },
                {
                  model: SalaryRange,
                },
                {
                  model: CandidateInterestCareer,
                  attributes: ['id', 'candidate_interest_id', 'df_career_id'],
                  include: [
                    {
                      model: DFCareer,
                      attributes: ['id', 'name'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!foundUser || !foundUser.candidate_information) {
      throw new HttpException(
        'Thông tin ứng viên không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    //Trả thêm thông tin bộ lọc đã lưu
    const foundSearchingData: any = await SearchingData.findOne({
      where: {
        user_id,
      },
    });

    const convert_metadata = JSON.parse(foundSearchingData?.metadata);
    foundSearchingData.dataValues.convert_metadata = convert_metadata;

    const foundProvinces = await DFProvince.findAll({
      where: {
        id: {
          [Op.in]: convert_metadata?.province_ids || [],
        },
      },
      attributes: ['id', 'name', 'value', 'prefix', 'is_active'],
    });
    foundSearchingData.dataValues.convert_metadata.province_ids =
      foundProvinces;

    const foundCareers = await DFCareer.findAll({
      where: {
        id: {
          [Op.in]: convert_metadata?.career_ids || [],
        },
      },
      attributes: ['id', 'name'],
    });
    foundSearchingData.dataValues.convert_metadata.career_ids = foundCareers;

    const foundYearsOfExperience = await YearOfExperience.findAll({
      where: {
        id: {
          [Op.in]: convert_metadata?.years_of_experience_ids || [],
        },
      },
      attributes: ['id', 'description'],
    });
    foundSearchingData.dataValues.convert_metadata.years_of_experience_ids =
      foundYearsOfExperience;

    const foundSalaryRange = await SalaryRange.findAll({
      where: {
        id: {
          [Op.in]: convert_metadata?.salary_range_ids || [],
        },
      },
      attributes: ['id', 'description'],
    });
    foundSearchingData.dataValues.convert_metadata.salary_range_ids =
      foundSalaryRange;

    const foundPositions = await Position.findAll({
      where: {
        id: {
          [Op.in]: convert_metadata?.position_ids || [],
        },
      },
      attributes: ['id', 'name'],
    });
    foundSearchingData.dataValues.convert_metadata.position_ids =
      foundPositions;

    return sendSuccess({
      data: {
        interest_data: foundUser.candidate_information.candidate_interest,
        searching_data: foundSearchingData,
      },
    });
  }
}
