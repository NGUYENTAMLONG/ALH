// Nest dependencies
import { Injectable } from '@nestjs/common';

// Other dependencies
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';

// Local files
import { configService } from './config.service';
import { MailSenderAdminBody, MailSenderBody } from './types';

@Injectable()
export class MailService {
  private readonly configTransport = {
    service: configService.getEnv('SMTP_SERVICE'),
    host: configService.getEnv('SMTP_HOST'),
    port: configService.getEnv('SMTP_PORT'),
    secure: true,
    auth: {
      user: configService.getEnv('SMTP_MAIL'),
      pass: configService.getEnv('SMTP_PASSWORD'),
    },
  };

  public async sendPasswordCreateEnterprise(
    bodyData: MailSenderBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/create-new-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          email: bodyData.text.email,
          phone_number: bodyData.text.phone_number,
          password: bodyData.text.password,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendTestEmail(bodyData: MailSenderBody): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/test.ejs`,
        {
          codeForgotPassword: bodyData.text,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendCreateEnterpriseToAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/create-new-enterprise-to-admin.ejs`,
        {
          enterprise_name: bodyData.text.enterprise_name,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendSearchDetailCandidateToAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/detail-search-candidate-to-admin.ejs`,
        {
          enterprise_name: bodyData.text.enterprise_name,
          data: bodyData.text.data,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-recruitment-to-enterprise.ejs`,
        {
          recruitment_code: bodyData.text.recruitment_code,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendCreateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/create-recruitment-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendCreateRecruitmentToAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/create-recruitment-to-admin.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          customer_name: bodyData.text.customer_name,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateInProgressRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-recruitment-status-in-progress-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                console.log(error);
                // reject(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateProcessedRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-recruitment-status-processed-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateCompletedRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-recruitment-status-completed-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error)
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateRejectRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-recruitment-status-reject-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                //  reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateResponsibleSaleRecruitmentToUser(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-responsible-sale-to-recruitment-user.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error)
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendUpdateImplementSaleRecruitmentToUser(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-implement-sale-to-recruitment-user.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendAddCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/add-candidate-recruitment-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          professional_field: bodyData.text.professional_field,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendAddCandidateRecruitmentToAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/add-candidate-recruitment-to-admin.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          professional_field: bodyData.text.professional_field,
          user_name: bodyData.text.user_name,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendAddCandidateRecruitmentToResponsibleSale(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/add-candidate-recruitment-to-responsible-sale.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          professional_field: bodyData.text.professional_field,
          user_name: bodyData.text.user_name,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusApproveCVCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-choose-cv-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusRejectCVCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-reject-cv-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusScheduleInterviewCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-schedule-interview-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusScheduleInterviewCandidateRecruitmentToCandidate(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-schedule-interview-to-candidate.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusReScheduleInterviewCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-re-schedule-interview-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusReScheduleInterviewCandidateRecruitmentToCandidate(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-re-schedule-interview-to-candidate.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusSuccessInterviewCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-success-interview-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusSuccessInterviewCandidateRecruitmentToCandidate(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-success-interview-to-candidate.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusFailInterviewCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-fail-interview-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusFailInterviewCandidateRecruitmentToCandidate(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-fail-interview-to-candidate.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusGetAJobCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-get-a-job-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusGetAJobCandidateRecruitmentToCandidate(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-get-a-job-to-candidate.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          enterprise_name: bodyData.text.enterprise_name,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendChangeStatusNotGetAJobCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-not-get-a-job-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          note: bodyData.text.note,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendRemindInterviewCandidateRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/remind-interview-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
          interviewer: bodyData.text.interviewer,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendRemindInterviewCandidateRecruitmentToAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/remind-interview-to-admin.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
          interviewer: bodyData.text.interviewer,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendRemindInterviewCandidateRecruitmentToCandidate(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/remind-interview-to-candidate.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          recruitment_id: bodyData.text.recruitment_id,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          time: bodyData.text.time,
          address: bodyData.text.address,
          interviewer: bodyData.text.interviewer,
          date: bodyData.text.date,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateAddWalletToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-add-wallet-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          value: bodyData.text.value,
          balance: bodyData.text.balance,
          time: bodyData.text.time,
          note: bodyData.text.note,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateSubWalletToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-sub-wallet-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          value: bodyData.text.value,
          balance: bodyData.text.balance,
          time: bodyData.text.time,
          note: bodyData.text.note,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateSubWalletRecruitmentToEnterprise(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-sub-wallet-recruitment-to-enterprise.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginEnterprise: bodyData.text.webLoginEnterprise,
          enterprise_name: bodyData.text.enterprise_name,
          value: bodyData.text.value,
          balance: bodyData.text.balance,
          time: bodyData.text.time,
          text_input: bodyData.text.text_input,
          note: bodyData.text.note,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async adminCreateHROToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/admin-create-hro-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_full_name: bodyData.text.hro_full_name,
          email: bodyData.text.email,
          phone_number: bodyData.text.phone_number,
          password: bodyData.text.password,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async registerAccountToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/hro-register-account-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          hro_full_name: bodyData.text.hro_full_name,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async adminApproveHROToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/admin-approve-hro-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async adminRejectHROToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/admin-reject-hro-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }
  public async adminAddHROInRecruitmentToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const transporter = await nodemailer.createTransport(
          this.configTransport,
        );

        const data = await ejs.renderFile(
          `${process.cwd()}/src/shared/mail-templates/add-hro-recruitment-to-hro.ejs`,
          {
            logo_url: bodyData.text.logo_url,
            enterprise_name: bodyData.text.enterprise_name,
            position: bodyData.text.position,
            webLoginAdmin: bodyData.text.webLoginAdmin,
            recruitment_id: bodyData.text.recruitment_id,
          },
        );

        const mailOptions: object = {
          from: configService.getEnv('SMTP_MAIL'),
          to: bodyData.receiver_email,
          subject: bodyData.subject,
          html: data,
        };

        await transporter.sendMail(mailOptions);
        resolve();
      } catch (error) {
        console.log(error);
      }
    });
  }

  public async hroAddCandidateInRecruitmentToAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/hro-add-candidate-recruitment-to-admin.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          enterprise_name: bodyData.text.enterprise_name,
          position: bodyData.text.position,
          hro_name: bodyData.text.hro_name,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          recruitment_id: bodyData.text.recruitment_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async adminChooseCVCandidateInRecruitmentToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/change-status-candidate-recruitment-choose-cv-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          recruitment_id: bodyData.text.recruitment_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async adminUpdateAddWalletApproveCVToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-add-wallet-approve-cv-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          hro_name: bodyData.text.hro_name,
          candidate_name: bodyData.text.candidate_name,
          balance: bodyData.text.balance,
          value: bodyData.text.value,
          time: bodyData.text.time,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async adminUpdateAddWalletGetJobToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-add-wallet-get-job-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          hro_name: bodyData.text.hro_name,
          candidate_name: bodyData.text.candidate_name,
          balance: bodyData.text.balance,
          value: bodyData.text.value,
          time: bodyData.text.time,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateAddWalletToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-add-wallet-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_name: bodyData.text.hro_name,
          value: bodyData.text.value,
          balance: bodyData.text.balance,
          time: bodyData.text.time,
          note: bodyData.text.note,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateSubWalletToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-sub-wallet-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_name: bodyData.text.hro_name,
          value: bodyData.text.value,
          balance: bodyData.text.balance,
          time: bodyData.text.time,
          note: bodyData.text.note,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateAddUserPointToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-add-user-point-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_name: bodyData.text.hro_name,
          value: bodyData.text.value,
          point: bodyData.text.point,
          time: bodyData.text.time,
          note: bodyData.text.note,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async updateSubUserPointToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-sub-user-point-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_name: bodyData.text.hro_name,
          value: bodyData.text.value,
          point: bodyData.text.point,
          time: bodyData.text.time,
          note: bodyData.text.note,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendAddCandidateRecruitmentToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/add-candidate-recruitment-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          hro_name: bodyData.text.hro_name,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          created_name: bodyData.text.created_name,
          point: bodyData.text.point,
          current_point: bodyData.text.current_point,
          time: bodyData.text.time,
          note: bodyData.text.note,
          webLoginAdmin: bodyData.text.webLoginAdmin,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendSubUserPointOfHROToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/update-sub-user-point-delete-candidate-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          hro_name: bodyData.text.hro_name,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          created_name: bodyData.text.created_name,
          value: bodyData.text.value,
          point: bodyData.text.point,
          time: bodyData.text.time,
          note: bodyData.text.note,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          hro_id: bodyData.text.hro_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async enterpriseSendApproveCVtoAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/enterprise-change-status-candidate-recruitment-choose-cv-to-admin.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          enterprise_name: bodyData.text.enterprise_name,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          recruitment_id: bodyData.text.recruitment_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async enterpriseSendRejectCVtoAdmin(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/enterprise-reject-cv-candidate-recruitment-choose-cv-to-admin.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          enterprise_name: bodyData.text.enterprise_name,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          recruitment_id: bodyData.text.recruitment_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async sendAddHROCandidateRecruitmentToHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/add-hro-candidate-recruitment-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          hro_name: bodyData.text.hro_name,
          enterprise_name: bodyData.text.enterprise_name,
          recruitment_code: bodyData.text.recruitment_code,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          recruitment_id: bodyData.text.recruitment_id,
          candidate_name: bodyData.text.candidate_name,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }

  public async enterpriseSendApproveCVtoHRO(
    bodyData: MailSenderAdminBody,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport(
        this.configTransport,
      );

      await ejs.renderFile(
        `${process.cwd()}/src/shared/mail-templates/enterprise-change-status-candidate-recruitment-choose-cv-to-hro.ejs`,
        {
          logo_url: bodyData.text.logo_url,
          candidate_name: bodyData.text.candidate_name,
          recruitment_code: bodyData.text.recruitment_code,
          webLoginAdmin: bodyData.text.webLoginAdmin,
          recruitment_id: bodyData.text.recruitment_id,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiver_email,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) {
                // reject(error);
                console.log(error);
              }
              resolve();
            });
          }
        },
      );
    });
  }
}
