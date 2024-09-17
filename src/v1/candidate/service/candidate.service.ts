// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Other dependencies
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
// Local files
import { UpdateEnterpriseLogoDto } from '@enterprise/dto/update-enterprise-logo.dto';
import { UpdateEnterpriseDto } from '@enterprise/dto/update-enterprise.dto';
import { DFDistrict } from '@models/df-district.model';
import { DFProvince } from '@models/df-province.model';
import { DFWard } from '@models/df-ward.model';
import { EnterPriseAddressRepository } from '@repositories/enterprise-address.repository';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { PositionRepository } from '@repositories/position.repository';
import { ProfessionalFieldRepository } from '@repositories/professional-field.repository';
import { UserRepository } from '@repositories/user.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { sendSuccess } from '@utils/send-success';
import { ROLE } from '@utils/constants';
import { Wallet } from '@models/wallet.model';
import { UserPoint } from '@models/user-point.model';
import { Application } from '@models/application.model';
import { ApplicationCV } from '@models/application-cv.model';
import { CandidateFile } from '@models/candidate-file.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { CandidateInformationRepository } from '@repositories/candidate-information.repository';

@Injectable()
export class CandidateService {
  constructor(
    private readonly positionRepository: PositionRepository,
    private readonly professionalFieldRepository: ProfessionalFieldRepository,
    private readonly enterPriseAddressRepository: EnterPriseAddressRepository,
    private readonly userRepository: UserRepository,
    private readonly sequelize: Sequelize,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly walletRepository: WalletRepository,
    private readonly candidateInformationRepository: CandidateInformationRepository,
  ) {}

  async update(id: number, dto: UpdateEnterpriseDto) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: {
        user_id: id,
      },
    });
    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const foundPhoneNumber = await this.userRepository.findOne({
      where: {
        phone_number: dto.phone_number,
        id: { [Op.ne]: id },
      },
    });

    if (foundPhoneNumber) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trên hệ thống hehe!',
        HttpStatus.FOUND,
      );
    }

    const foundEmail = await this.userRepository.findOne({
      where: {
        email: dto.email,
        id: { [Op.ne]: id },
      },
    });

    if (foundEmail) {
      throw new HttpException(
        'Email đã tồn tại trên hệ thống',
        HttpStatus.FOUND,
      );
    }

    let alternatePhone = null;
    if (dto.alternate_phone) {
      alternatePhone = await this.userRepository.findOne({
        where: {
          alternate_phone: {
            [Op.and]: [
              {
                [Op.not]: 'null',
              },
              {
                [Op.eq]: dto.alternate_phone,
              },
            ],
          },
          id: { [Op.ne]: id },
        },
      });

      if (alternatePhone) {
        throw new HttpException(
          'Số điện thoại phụ đã tồn tại trên hệ thống',
          HttpStatus.FOUND,
        );
      }
    }
    if (dto.professional_field_id) {
      const professionalField = await this.professionalFieldRepository.findOne({
        where: {
          id: dto.professional_field_id,
        },
      });
      if (!professionalField) {
        throw new HttpException(
          'Lĩnh vực làm việc  không tồn tại trên hệ thống',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const result = await this.sequelize.transaction(
      async (transaction: Transaction) => {
        try {
          const payloadUpdateUser = {
            phone_number: dto.phone_number,
            alternate_phone: dto.alternate_phone,
            email: dto.email,
            full_name: dto.manager,
          };

          await this.userRepository.update(payloadUpdateUser, {
            where: {
              id,
            },
            transaction,
          });

          const payloadUpdateEnterprise = {
            name: dto.name,
            position: dto?.position || null,
            professional_field_id: dto?.professional_field_id || null,
            website: dto.website,
            facebook: dto.facebook,
            linkedin: dto.linkedin,
            description: dto.description,
            professional_field_text: dto.professional_field_text,
            employee_count: dto.employee_count,
            salesperson: dto.salesperson || null,
          };

          await this.enterpriseRepository.update(payloadUpdateEnterprise, {
            where: {
              user_id: id,
            },
            transaction,
          });

          const payloadUpdateAddress = {
            address: dto.address || null,
            df_province_id: dto.province,
            df_district_id: dto.district || null,
            df_ward_id: dto.ward || null,
          };
          const foundEnterpriseAddress =
            await this.enterPriseAddressRepository.findOne({
              where: {
                enterprise_id: enterprise.id,
              },
            });
          if (foundEnterpriseAddress) {
            await this.enterPriseAddressRepository.update(
              payloadUpdateAddress,
              {
                where: {
                  enterprise_id: enterprise?.id,
                },
                transaction,
              },
            );
          } else {
            await this.enterPriseAddressRepository.create(
              { ...payloadUpdateAddress, enterprise_id: enterprise.id },
              { transaction },
            );
          }

          // const position = await this.positionRepository.findOne({
          //   where: {
          //     id: enterprise?.position_id,
          //   },
          // });

          const professionalField =
            await this.professionalFieldRepository.findOne({
              where: {
                id: enterprise?.professional_field_id,
              },
            });

          const data = {
            email: dto.email,
            phone_number: dto.phone_number,
            alternate_phone: dto.alternate_phone || null,
            name: dto.name,
            logo: dto.logo || null,
            description: dto.description,
            website: dto.website,
            linkedin: dto.linkedin,
            facebook: dto.facebook,
            manager: dto.manager,
            position: dto.position,
            professional_field: professionalField,
            address: dto.address,
          };

          return data;
        } catch (error) {
          throw new HttpException(
            'Có lỗi xảy ra không thể cập nhật thông tin doanh nghiệp lúc này',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      },
    );

    return sendSuccess({ data: result });
  }

  // async findOne(id: number) {
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!user) {
  //     throw new HttpException(
  //       'Người dùng không tồn tại trên hệ thống',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   const foundEnterPrise = await this.enterpriseRepository.findOne({
  //     where: {
  //       user_id: id,
  //     },
  //   });

  //   if (!foundEnterPrise) {
  //     throw new HttpException(
  //       'Doanh nghiệp không tồn tại trên hệ thống',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   // const position = await this.positionRepository.findOne({
  //   //   where: {
  //   //     id: foundEnterPrise.position_id,
  //   //   },
  //   // });

  //   const professionalField = await this.professionalFieldRepository.findOne({
  //     where: {
  //       id: foundEnterPrise.professional_field_id,
  //     },
  //   });

  //   const enterpriseAddress = await this.enterPriseAddressRepository.findOne({
  //     where: {
  //       enterprise_id: foundEnterPrise.id,
  //     },
  //     include: [
  //       {
  //         model: DFDistrict,
  //       },
  //       {
  //         model: DFWard,
  //       },
  //       {
  //         model: DFProvince,
  //       },
  //     ],
  //   });
  //   const wallet = await this.walletRepository.findOne({
  //     where: {
  //       user_id: id,
  //     },
  //   });
  //   const data = {
  //     id: user.id,
  //     email: user.email,
  //     phone_number: user.phone_number,
  //     alternate_phone: user.alternate_phone || null,
  //     name: foundEnterPrise.name,
  //     logo: foundEnterPrise.logo || null,
  //     description: foundEnterPrise.description,
  //     status: foundEnterPrise.status,
  //     tax_code: foundEnterPrise.tax_code,
  //     website: foundEnterPrise.website,
  //     linkedin: foundEnterPrise.linkedin,
  //     facebook: foundEnterPrise.facebook,
  //     salesperson: foundEnterPrise.salesperson,
  //     manager: user.full_name,
  //     position: foundEnterPrise.position,
  //     professional_field: professionalField,
  //     enterprise_address: enterpriseAddress,
  //     professional_field_text: foundEnterPrise.professional_field_text,
  //     employee_count: foundEnterPrise.employee_count,
  //     balance: wallet ? wallet.balance : 0,
  //   };

  //   return sendSuccess({ data });
  // }

  async getInfo(user_id: number) {
    let user: any = await this.userRepository.findOne({
      where: {
        id: user_id,
        role_id: {
          [Op.in]: [
            ROLE.ADMIN,
            ROLE.IMPLEMENTATION_SALE,
            ROLE.RESPONSIBLE_SALE,
            ROLE.HRO,
            ROLE.CANDIDATE,
          ],
        },
      },
      include: [
        {
          model: Wallet,
        },
        {
          model: UserPoint,
        },
      ],
    });

    if (!user)
      throw new HttpException(
        'Người dùng không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );

    if (user.role_id === ROLE.CANDIDATE) {
      const foundCandidateInformation =
        await this.candidateInformationRepository.findOne({
          where: {
            user_id: user.id,
          },
          include: [
            {
              model: CandidateFile,
            },
            {
              model: CandidateInformationFile,
            },
            {
              model: CandidateProvince,
              attributes: ['id', 'candidate_information_id', 'df_province_id'],
              include: [
                {
                  model: DFProvince,
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        });

      // Chuyển đổi user sang đối tượng thuần túy
      user = user.toJSON();

      // Gán candidate_information vào user
      user.candidate_information = foundCandidateInformation
        ? foundCandidateInformation.toJSON()
        : null;

      const foundMainApplication = await Application.findOne({
        where: {
          candidate_information_id: foundCandidateInformation?.id,
          is_main: 1,
        },
      });

      user.application_cv_file = foundMainApplication
        ? await ApplicationCV.findOne({
            where: {
              application_id: foundMainApplication?.id,
              is_main: 1,
            },
          })
        : null;
    }

    return sendSuccess({ data: user });
  }
}
