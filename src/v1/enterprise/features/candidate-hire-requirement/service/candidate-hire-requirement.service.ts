// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local dependencies
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { User } from '@models/user.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { CandidateHireRequirementRepository } from '@repositories/candidate-hire-requirement.repository';
import { UserRepository } from '@repositories/user.repository';
import {
  CANDIDATE_HIRE_REQUIREMENT_STATUS,
  IS_ACTIVE,
  JOB_TYPE,
} from '@utils/constants';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { FilterEnterpriseCandidateHireRequirementDto } from '../dto/filter-candidate-hire-requirement.dto';

@Injectable()
export class EnterpriseCandidateHireRequirementService {
  constructor(
    private readonly candidateHireRequirementRepository: CandidateHireRequirementRepository,
    private readonly userRepository: UserRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(
    user_id: number,
    dto: FilterEnterpriseCandidateHireRequirementDto,
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
      status: dto.status,
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
    if (dto.salary_range_id) {
      whereOption.salary_range_id = dto.salary_range_id;
    }

    if (dto.job_type == JOB_TYPE.CALL) {
      whereOption[Op.and].push({
        candidate_information_id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information.id FROM candidate_information
              WHERE type_on_call = ${IS_ACTIVE.ACTIVE}`,
            ),
          ],
        },
      });
    } else if (dto.job_type == JOB_TYPE.HOUR) {
      whereOption[Op.and].push({
        candidate_information_id: {
          [Op.in]: [
            Sequelize.literal(
              `SELECT candidate_information.id FROM candidate_information
              WHERE type_on_hour = ${IS_ACTIVE.ACTIVE}`,
            ),
          ],
        },
      });
    }
    const options: any = {
      where: whereOption,
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
}
