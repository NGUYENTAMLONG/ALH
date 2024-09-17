// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local dependencies
import { CandidateHireRequirement } from '@models/candidate-hire-requirement.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';
import { HireRequirementRepository } from '@repositories/hire-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import { CANDIDATE_HIRE_REQUIREMENT_STATUS, IS_ACTIVE } from '@utils/constants';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminCreateCandidateHireRequirementDto } from '../dto/create-candidate-hire-requirement.dto';
import { FilterAdminCandidateHireRequirement } from '../dto/filter-candidate-hire-requirement.dto';
import { AdminUpdateCandidateHireRequirementDto } from '../dto/update-candidate-hire-requirement.dto';

@Injectable()
export class AdminCandidateHireRequirementService {
  constructor(
    private readonly candidateHireRequirementRepository: CandidateHireRequirementRepository,
    private readonly hireRequirementRepository: HireRequirementRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
    private readonly userRepository: UserRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async create(user_id: number, dto: AdminCreateCandidateHireRequirementDto) {
    const hireRequirement = await this.hireRequirementRepository.findOne({
      where: { id: dto.hire_requirement_id },
    });
    if (!hireRequirement) {
      throw new HttpException(
        'Yêu cầu thuê không tồn tại trên hệ thống.',
        HttpStatus.NOT_FOUND,
      );
    }
    let bulkCreated: any[] = [];
    for (let index = 0; index < dto.candidate_information_ids.length; index++) {
      try {
        const candidate = await this.candidateInformationRepository.findOne({
          where: {
            id: dto.candidate_information_ids[index],
            is_hire: IS_ACTIVE.ACTIVE,
          },
          include: [{ model: User }],
        });
        if (!candidate) {
          throw new HttpException(
            'Ứng viên không tồn tại trên hệ thống. ',
            HttpStatus.NOT_FOUND,
          );
        }
        const foundCandidateHireRequirement =
          await this.candidateHireRequirementRepository.findOne({
            where: {
              hire_requirement_id: dto.hire_requirement_id,
              candidate_information_id: dto.candidate_information_ids[index],
            },
          });
        if (foundCandidateHireRequirement) {
          throw new HttpException(
            `Ứng viên ${candidate.user.full_name} đã ở trong yêu cầu thuê. Không thêm ứng viên vào yêu cầu thuê dụng được!`,
            HttpStatus.BAD_REQUEST,
          );
        }
        bulkCreated = bulkCreated.concat({
          hire_requirement_id: dto.hire_requirement_id,
          candidate_information_id: dto.candidate_information_ids[index],
          status: CANDIDATE_HIRE_REQUIREMENT_STATUS.PENDING,
          created_by: user_id,
        });
      } catch (error) {}
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      try {
        await this.candidateHireRequirementRepository.bulkCreate(bulkCreated, {
          transaction,
        });
      } catch (error) {
        console.log(error);

        throw new HttpException(
          'Có lỗi xảy ra không thể thêm ứng viên vào yêu cầu thuê dụng lúc này',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return sendSuccess({
      msg: 'Thêm mới ứng viên thành công',
    });
  }

  async findAll(
    user_id: number,
    dto: FilterAdminCandidateHireRequirement,
  ): Promise<any> {
    const foundUser = await this.userRepository.findByPk(user_id);
    if (!foundUser) {
      throw new HttpException(
        'Người dùng không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const whereOption: any = {
      hire_requirement_id: dto.hire_requirement_id,
      [Op.and]: [],
    };
    if (dto.search) {
      whereOption[Op.and].push({
        candidate_information_id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information.id FROM candidate_information JOIN user ON user.id = candidate_information.user_id
              WHERE user.full_name LIKE '%${dto.search}%'`,
            ),
          ],
        },
      });
    }
    if (dto.status) {
      whereOption.status = { [Op.in]: dto.status.split(',') };
    }
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereOption.created_at = { [Op.between]: [fromDate, toDate] };
    }

    const options: any = {
      where: whereOption,
      attributes: {
        include: [
          [
            this.sequelize.literal(
              `(
              SELECT JSON_OBJECT('full_name',full_name,'role',CASE
              WHEN role_id = 1 THEN "Admin"
              WHEN role_id = 2 THEN "Enterprise"
              WHEN role_id = 3 THEN "Ứng viên"
              WHEN role_id = 4 THEN "Sale triển khai"
              WHEN role_id = 5 THEN "Sale phụ trách"
              WHEN role_id = 7 THEN "Cộng tác viên"
              ELSE "HRO"
              END) FROM user
              WHERE id = CandidateHireRequirement.created_by
              LIMIT 1
             )`,
            ),
            'created_by_info',
          ],
        ],
      },
      include: [
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: [
            {
              model: User,
              attributes: [
                'id',
                'full_name',
                'phone_number',
                'avatar',
                'email',
                'gender_id',
              ],
            },
            {
              model: CandidateProvince,
              attributes: {
                include: [
                  [
                    Sequelize.literal(
                      `(
                        SELECT name FROM df_province
                        WHERE id = \`candidate_information->candidate_province\`.df_province_id
                        LIMIT 1
                       )`,
                    ),
                    'province_name',
                  ],
                ],
              },
            },
            {
              model: CandidateJobType,
              attributes: {
                include: [
                  [
                    Sequelize.literal(
                      `(
                        SELECT name FROM job_type
                        WHERE id = \`candidate_information->candidate_job_type\`.job_type_id
                        LIMIT 1
                       )`,
                    ),
                    'job_type_name',
                  ],
                ],
              },
            },
            {
              model: YearOfExperience,
            },
            { model: CandidateInformationFile },
          ],
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.candidateHireRequirementRepository.count({
      where: whereOption,
    });
    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );
    options.limit = page_size;
    options.offset = offset;
    const candidateHireRequirement =
      await this.candidateHireRequirementRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: candidateHireRequirement,
      paging,
      blocks: {
        status: CANDIDATE_HIRE_REQUIREMENT_STATUS,
      },
    });
  }
  async updateStatus(id: number, dto: AdminUpdateCandidateHireRequirementDto) {
    const candidateHireRequirement: CandidateHireRequirement | null =
      await this.candidateHireRequirementRepository.findOne({
        where: {
          id,
        },
      });
    if (!candidateHireRequirement) {
      throw new HttpException(
        'Ứng viên trong yêu cầu thuê không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.sequelize.transaction(async (transaction: Transaction) => {
      await candidateHireRequirement.update(
        { status: dto.status },
        { transaction },
      );
    });
    return sendSuccess({ msg: 'Cập nhật trạng thái ứng viên thành công' });
  }
}
