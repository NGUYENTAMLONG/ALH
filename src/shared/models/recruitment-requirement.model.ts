// Other dependencies
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

// Local files
import { IS_ACTIVE, RECRUITMENT_STATUS, getFullUrl } from '@utils/constants';
import { AgeGroup } from './age-group.model';
import { CandidateRecruitment } from './candidate-recruitment.model';
import { Enterprise } from './enterprise.model';
import { FeeOfRecruitmentRequirement } from './fee-of-recruitment-requirement.model';
import { Gender } from './gender.model';
import { ProfessionalField } from './professional-field.model';
import { RecruitmentJobType } from './recruitment-job-type.model';
import { RecruitmentRequirementFile } from './recruitment-requirement-file.model';
import { RecruitmentRequirementHistory } from './recruitment-requirement-history.model';
import { RecruitmentRequirementHro } from './recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from './recruitment-requirement-implementation.model';
import { RecruitmentRequirementProvince } from './recruitment-requirement-province.model';
import { SalaryRange } from './salary-range.model';
import { UserPointHistory } from './user-point-history.model';
import { User } from './user.model';
import { WalletHistory } from './wallet-history.model';
import { YearOfExperience } from './year-of-experience.model';
import { DFCareer } from './df-career.model';
import { Position } from './position.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'recruitment_requirement',
})
export class RecruitmentRequirement extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  professional_field_id: number; //Lĩnh vực tuyển dụng

  @Column({
    allowNull: true,
  })
  position_id: number; //Vị trí tuyển dụng

  @Column({
    allowNull: false,
  })
  enterprise_id: number;

  @Column({
    allowNull: true,
  })
  salary_range_id: number;

  @Column({
    allowNull: true,
  })
  years_of_experience_id: number;

  @Column({
    allowNull: true,
  })
  career_id: number;

  @Column({
    allowNull: true,
  })
  professional_field_input: string;

  @Column({
    allowNull: true,
  })
  position_input: string;

  @Column({
    allowNull: true,
  })
  age_group_id: number;

  @Column({
    allowNull: true,
    comment: 'user id có role là doanh nghiệp/HRO',
  })
  created_by: number;

  @Column({
    allowNull: true,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_all_province: number;

  @Column({
    allowNull: true,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_all_hro: number;

  @Column({
    allowNull: true,
  })
  recruitment_requirement_type_id: number;

  @Column({
    allowNull: true,
  })
  gender_id: number;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  job_description: string;

  @Column
  code: string;

  @Column({
    defaultValue: 0,
    type: DataType.DECIMAL(18, 0),
  })
  recruitment_count: number;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  benefits_and_treatment: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  enterprise_introduction: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
    get() {
      return getFullUrl(this.getDataValue('file'));
    },
  })
  file: string;

  @Column({
    allowNull: false,
    defaultValue: RECRUITMENT_STATUS.PENDING,
  })
  status: number;

  @Column({
    allowNull: true,
  })
  responsible_sale_id: number;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  created_on_mini_app: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  apply_deadline: Date;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  work_address: string;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  modify_date_processed: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => ProfessionalField, { foreignKey: 'professional_field_id' })
  professional_field: ProfessionalField;

  @BelongsTo(() => Position, { foreignKey: 'position_id' })
  position: Position;

  @HasMany(() => RecruitmentJobType, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_job_type: RecruitmentJobType[];

  @HasMany(() => RecruitmentRequirementFile, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement_file: RecruitmentRequirementFile[];

  @BelongsTo(() => YearOfExperience, { foreignKey: 'years_of_experience_id' })
  year_of_experience: YearOfExperience;

  @BelongsTo(() => Gender, { foreignKey: 'gender_id' })
  gender: Gender;

  @BelongsTo(() => AgeGroup, { foreignKey: 'age_group_id' })
  age_group: AgeGroup;

  @BelongsTo(() => SalaryRange, { foreignKey: 'salary_range_id' })
  salary_range: SalaryRange;

  @BelongsTo(() => DFCareer, { foreignKey: 'career_id' })
  career: DFCareer;

  @BelongsTo(() => Enterprise, { foreignKey: 'enterprise_id' })
  enterprise: Enterprise;

  @BelongsTo(() => User, { foreignKey: 'responsible_sale_id' })
  responsible_sale: User;

  @HasMany(() => RecruitmentRequirementImplementation, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement_implementation: RecruitmentRequirementImplementation[];

  @HasMany(() => RecruitmentRequirementHro, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement_hro: RecruitmentRequirementHro[];

  @HasMany(() => FeeOfRecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  fee_of_recruitment_requirement: FeeOfRecruitmentRequirement;

  @HasMany(() => CandidateRecruitment, {
    foreignKey: 'recruitment_requirement_id',
  })
  candidate_recruitment: CandidateRecruitment;

  @HasMany(() => RecruitmentRequirementHistory, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement_history: RecruitmentRequirementHistory;

  @HasMany(() => RecruitmentRequirementProvince, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement_province: RecruitmentRequirementProvince[];

  @HasMany(() => WalletHistory, {
    foreignKey: 'recruitment_requirement_id',
  })
  wallet_history: WalletHistory;

  @HasOne(() => UserPointHistory, {
    foreignKey: 'recruitment_requirement_id',
  })
  user_point_history: UserPointHistory;
}
