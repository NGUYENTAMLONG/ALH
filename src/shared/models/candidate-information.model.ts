import { CANDIDATE_STATUS, IS_ACTIVE } from '@utils/constants';
import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateFile } from './candidate-file.model';
import { CandidateHireRequirement } from './candidate-hire-requirement.model';
import { CandidateImage } from './candidate-image.model';
import { CandidateInformationFile } from './candidate-information-file.model';
import { CandidateInterview } from './candidate-interview.model';
import { CandidateJobType } from './candidate-job-type.model';
import { CandidateProvince } from './candidate-province.model';
import { CandidateRecruitment } from './candidate-recruitment.model';
import { HirePrice } from './hire-price.model';
import { InterestListTransaction } from './interest-list-transaction.model';
import { InterestList } from './interest-list.model';
import { RecruitmentRequirementHistory } from './recruitment-requirement-history.model';
import { SalaryRange } from './salary-range.model';
import { TrackingLog } from './tracking-log.model';
import { UserPointHistory } from './user-point-history.model';
import { User } from './user.model';
import { WalletHistory } from './wallet-history.model';
import { WorkExperience } from './work-experience.model';
import { YearOfExperience } from './year-of-experience.model';
import { DFDegree } from './df-degree.model';
import { Position } from './position.model';
import { CandidateInterest } from './candidate-interest.model';
import { Application } from './application.model';
import { CVUploaded } from './cv-uploaded.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_information',
})
export class CandidateInformation extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @Column({
    allowNull: true,
  })
  years_of_experience_id: number;

  @Column({
    allowNull: true,
  })
  position_id: number;

  @Column({
    allowNull: true,
  })
  degree_id: number;

  @Column({
    allowNull: true,
  })
  professional_field_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  professional_field: string;

  @Column
  is_all_province: number;

  @Column({
    allowNull: true,
  })
  salary_range_id: number;

  @Column({
    allowNull: false,
    defaultValue: CANDIDATE_STATUS.OPEN_CV,
  })
  status: number;

  @Column({
    type: DataTypes.TEXT,
  })
  note: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  skill_input: string;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_recruitment: number;

  @Column({
    type: DataTypes.INTEGER,
  })
  created_by: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_hire: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  type_on_call: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  type_on_hour: number;

  @Column({
    type: DataTypes.DECIMAL(18, 0),
  })
  budget_min: number;

  @Column({
    type: DataTypes.DECIMAL(18, 0),
  })
  budget_max: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasOne(() => HirePrice, { foreignKey: 'candidate_information_id' })
  hire_price: HirePrice;

  @HasMany(() => WorkExperience, { foreignKey: 'candidate_information_id' })
  work_experience: WorkExperience;

  @HasMany(() => CandidateJobType, { foreignKey: 'candidate_information_id' })
  candidate_job_type: CandidateJobType;

  @HasOne(() => CandidateFile, { foreignKey: 'candidate_information_id' })
  candidate_file: CandidateFile;

  @HasOne(() => CandidateInterest, { foreignKey: 'candidate_information_id' })
  candidate_interest: CandidateInterest;

  @HasMany(() => CandidateImage, { foreignKey: 'candidate_information_id' })
  candidate_image: CandidateImage;

  @HasMany(() => InterestList, { foreignKey: 'candidate_information_id' })
  interest_list: InterestList;

  @HasMany(() => InterestListTransaction, {
    foreignKey: 'candidate_information_id',
  })
  interest_list_transaction: InterestListTransaction;

  @HasMany(() => CandidateProvince, { foreignKey: 'candidate_information_id' })
  candidate_province: CandidateProvince;

  @BelongsTo(() => Position, {
    foreignKey: 'position_id',
  })
  position: Position;

  @BelongsTo(() => DFDegree, {
    foreignKey: 'degree_id',
  })
  degree: DFDegree;

  @BelongsTo(() => YearOfExperience, {
    foreignKey: 'years_of_experience_id',
  })
  year_of_experience: YearOfExperience;

  @BelongsTo(() => SalaryRange, {
    foreignKey: 'salary_range_id',
  })
  salary_range: SalaryRange;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
  })
  user: User;

  @HasMany(() => TrackingLog, {
    foreignKey: 'candidate_id',
  })
  tracking_log: TrackingLog;

  @HasMany(() => CandidateRecruitment, {
    foreignKey: 'candidate_information_id',
  })
  candidate_recruitment: CandidateRecruitment;

  @HasMany(() => CandidateInterview, {
    foreignKey: 'candidate_information_id',
  })
  candidate_interview: CandidateInterview;

  @HasMany(() => WalletHistory, {
    foreignKey: 'candidate_information_id',
  })
  wallet_history: WalletHistory;

  @HasOne(() => UserPointHistory, {
    foreignKey: 'candidate_information_id',
  })
  user_point_history: UserPointHistory;

  @HasMany(() => Application, { foreignKey: 'candidate_information_id' })
  applications: Application;

  @HasMany(() => CandidateInformationFile, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information_file: CandidateInformationFile;

  @HasOne(() => RecruitmentRequirementHistory, {
    foreignKey: 'candidate_information_id',
  })
  recruitment_requirement_history: RecruitmentRequirementHistory;

  @HasMany(() => CandidateHireRequirement, {
    foreignKey: 'candidate_information_id',
  })
  candidate_hire_requirement: CandidateHireRequirement;

  @HasMany(() => CVUploaded, {
    foreignKey: 'candidate_info_review_id',
  })
  cv_uploaded: CVUploaded;
}
