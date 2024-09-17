// Local files
import { AgeGroup } from '@models/age-group.model';
import { BankAccount } from '@models/bank-account.model';
import { CandidateFile } from '@models/candidate-file.model';
import { CandidateHireRequirement } from '@models/candidate-hire-requirement.model';
import { CandidateImage } from '@models/candidate-image.model';
import { CandidateInformationFile } from '@models/candidate-information-file.model';
import { CandidateInformation } from '@models/candidate-information.model';
import { CandidateInterview } from '@models/candidate-interview.model';
import { CandidateJobType } from '@models/candidate-job-type.model';
import { CandidateProvince } from '@models/candidate-province.model';
import { CandidateRecruitment } from '@models/candidate-recruitment.model';
import { ConfigPointHro } from '@models/config-point-hro.model';
import { DFBank } from '@models/df-bank.model';
import { DFDistrict } from '@models/df-district.model';
import { DFProvince } from '@models/df-province.model';
import { DFWard } from '@models/df-ward.model';
import { EnterpriseAddress } from '@models/enterprise-address.model';
import { EnterpriseDataFieldSource } from '@models/enterprise-data-field-source.model';
import { EnterpriseDataField } from '@models/enterprise-data-field.model';
import { EnterpriseData } from '@models/enterprise-data.model';
import { Enterprise } from '@models/enterprise.model';
import { FeeOfRecruitmentRequirement } from '@models/fee-of-recruitment-requirement.model';
import { FeeType } from '@models/fee-type.model';
import { ForgotPassword } from '@models/forgot-password.model';
import { Gender } from '@models/gender.model';
import { HirePrice } from '@models/hire-price.model';
import { HireRequirementFile } from '@models/hire-requirement-file.model';
import { HireRequirementGender } from '@models/hire-requirement-gender.model';
import { HireRequirementJobType } from '@models/hire-requirement-job-type.model';
import { HireRequirementProfessionalField } from '@models/hire-requirement-professional-field.model';
import { HireRequirementProvince } from '@models/hire-requirement-province.model';
import { HireRequirementResponsible } from '@models/hire-requirement-responsible.model';
import { HireRequirement } from '@models/hire-requirement.model';
import { HroRequest } from '@models/hro-request.model';
import { InterestListJobType } from '@models/interest-list-job-type.model';
import { InterestListProvince } from '@models/interest-list-province.model';
import { InterestListTransaction } from '@models/interest-list-transaction.model';
import { InterestList } from '@models/interest-list.model';
import { JobTypeTime } from '@models/job-type-time.model';
import { JobTypeWorkplace } from '@models/job-type-workplace.model';
import { JobType } from '@models/job-type.model';
import { Notification } from '@models/notification.model';
import { Position } from '@models/position.model';
import { ProfessionalField } from '@models/professional-field.model';
import { RecruitmentJobType } from '@models/recruitment-job-type.model';
import { RecruitmentRequestFile } from '@models/recruitment-request-file.model';
import { RecruitmentRequirementFile } from '@models/recruitment-requirement-file.model';
import { RecruitmentRequirementHistory } from '@models/recruitment-requirement-history.model';
import { RecruitmentRequirementHro } from '@models/recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from '@models/recruitment-requirement-implementation.model';
import { RecruitmentRequirementProvince } from '@models/recruitment-requirement-province.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { RecruitmentTemplateJobType } from '@models/recruitment-template-job-type.model';
import { RecruitmentTemplate } from '@models/recruitment-template.model';
import { Role } from '@models/role.model';
import { SalaryRange } from '@models/salary-range.model';
import { TrackingLog } from '@models/tracking-log.model';
import { UserDataFieldSource } from '@models/user-data-field-source.model';
import { UserDataField } from '@models/user-data-field.model';
import { UserData } from '@models/user-data.model';
import { UserPointHistory } from '@models/user-point-history.model';
import { UserPoint } from '@models/user-point.model';
import { User } from '@models/user.model';
import { WalletHistory } from '@models/wallet-history.model';
import { Wallet } from '@models/wallet.model';
import { WorkExperience } from '@models/work-experience.model';
import { YearOfExperience } from '@models/year-of-experience.model';
import { ConfigService } from './config.service';
import { ConfigApprovalHro } from '@models/config-approval-hro.model';
import { DFCareer } from '@models/df-career.model';
import { UserCareerFavorite } from '@models/user-career-favorite.model';
import { DFDegree } from '@models/df-degree.model';
import { UserRecruitmentFavorite } from '@models/user-recruitment-favorite.model';
import { CandidateInterest } from '@models/candidate-interest.model';
import { CandidateInterestCareer } from '@models/candidate-interest-career.model';
import { CandidateApply } from '@models/candidate-apply.model';
import { Banner } from '@models/banner.model';
import { CandidateApplyFile } from '@models/candidate-apply-file.model';
import { Application } from '@models/application.model';
import { ApplicationCV } from '@models/application-cv.model';
import { ApplicationCareer } from '@models/application-career.model';
import { ApplicationJobType } from '@models/application-job-type.model';
import { ApplicationProvince } from '@models/application-province.model';
import { WalletRequirement } from '@models/wallet-requirement.model';
import { DFGroupCareer } from '@models/df-group-career.model';
import { EducationExperience } from '@models/education-experience.model';
import { SkillExperience } from '@models/skill-experience.model';
import { Referrer } from '@models/referrer.model';
import { CVUploaded } from '@models/cv-uploaded.model';
import { SearchingData } from '@models/searching-data.model';
import { TimelineStatus } from '@models/timeline-status.model';

export class SequelizeConfig extends ConfigService {
  public getSequelizeConfig(): any {
    return {
      dialect: this.getEnv('DB_TYPE') || 'mysql',
      host: this.getEnv('DB_HOST') || 'localhost',
      port: this.getEnv('DB_PORT') || 3306,
      username: this.getEnv('DB_USERNAME') || 'root',
      password: this.getEnv('DB_PASSWORD') || 'root',
      database: this.getEnv('DB_DATABASE') || 'test',
      models: [
        DFDistrict,
        DFProvince,
        DFWard,
        EnterpriseAddress,
        Enterprise,
        Position,
        ForgotPassword,
        Gender,
        Role,
        User,
        ProfessionalField,
        RecruitmentRequestFile,
        AgeGroup,
        YearOfExperience,
        SalaryRange,
        JobType,
        JobTypeTime,
        JobTypeWorkplace,
        CandidateJobType,
        CandidateInformation,
        CandidateFile,
        CandidateImage,
        HirePrice,
        WorkExperience,
        RecruitmentRequirement,
        RecruitmentJobType,
        RecruitmentTemplate,
        RecruitmentTemplateJobType,
        InterestList,
        InterestListTransaction,
        Notification,
        CandidateProvince,
        InterestListProvince,
        InterestListJobType,
        UserData,
        UserDataField,
        UserDataFieldSource,
        EnterpriseData,
        EnterpriseDataField,
        EnterpriseDataFieldSource,
        FeeOfRecruitmentRequirement,
        FeeType,
        CandidateRecruitment,
        TrackingLog,
        RecruitmentRequirementHistory,
        CandidateInterview,
        RecruitmentRequirementProvince,
        Wallet,
        WalletHistory,
        RecruitmentRequirementImplementation,
        RecruitmentRequirementFile,
        CandidateInformationFile,
        DFBank,
        BankAccount,
        HroRequest,
        RecruitmentRequirementHro,
        ConfigPointHro,
        UserPoint,
        UserPointHistory,
        HireRequirement,
        HireRequirementGender,
        HireRequirementJobType,
        HireRequirementProfessionalField,
        HireRequirementProvince,
        HireRequirementResponsible,
        CandidateHireRequirement,
        HireRequirementFile,
        ConfigApprovalHro,
        DFCareer,
        UserCareerFavorite,
        DFDegree,
        UserRecruitmentFavorite,
        CandidateInterest,
        CandidateInterestCareer,
        CandidateApply,
        CandidateApplyFile,
        Banner,
        Application,
        ApplicationCV,
        ApplicationCareer,
        ApplicationJobType,
        ApplicationProvince,
        WalletRequirement,
        DFGroupCareer,
        EducationExperience,
        SkillExperience,
        Referrer,
        CVUploaded,
        SearchingData,
        TimelineStatus,
      ],
      // autoLoadModels: true,
      synchronize: true,
      retryAttempts: 10,
      sync: {
        alter: false,
      },
    };
  }
}

export const configSequelize = new SequelizeConfig();
