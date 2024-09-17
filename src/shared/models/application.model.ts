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
import { CandidateInformation } from './candidate-information.model';
import { DFDegree } from './df-degree.model';
import { YearOfExperience } from './year-of-experience.model';
import { SalaryRange } from './salary-range.model';
import { Position } from './position.model';
import { GENDER, getFullUrl, IS_ACTIVE } from '@utils/constants';
import { TEXT } from 'sequelize';
import { ApplicationProvince } from './application-province.model';
import { ApplicationCareer } from './application-career.model';
import { ApplicationJobType } from './application-job-type.model';
import { WorkExperience } from './work-experience.model';
import { EducationExperience } from './education-experience.model';
import { Referrer } from './referrer.model';
import { SkillExperience } from './skill-experience.model';
import { ApplicationCV } from './application-cv.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'application',
})
export class Application extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  application_name: string;

  @Column({
    allowNull: true,
    defaultValue: null,
    get() {
      return getFullUrl(this.getDataValue('avatar'));
    },
  })
  avatar: string;

  @Column({
    allowNull: true,
  })
  full_name: string;

  @Column({
    allowNull: true,
  })
  phone_number: string;

  @Column({
    allowNull: true,
  })
  email: string;

  @Column({
    comment: 'PK bảng gender',
    defaultValue: GENDER.NO_UPDATE, // Chưa cập nhật giới tính
  })
  gender_id: number;

  @Column({
    allowNull: true,
  })
  address: string;

  @Column({
    allowNull: true,
    type: TEXT,
  })
  education: string;

  @Column({
    allowNull: true,
    type: TEXT,
  })
  skill_input: string;

  @Column({
    allowNull: true,
    type: TEXT,
  })
  career_goals: string;

  @Column({
    allowNull: true,
    type: TEXT,
  })
  position_input: string;

  @Column({
    allowNull: true,
  })
  date_of_birth: Date;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: true,
  })
  degree_id: number;

  @Column({
    allowNull: true,
  })
  year_of_experience_id: number;

  @Column({
    allowNull: true,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_all_province: number;

  @Column({
    allowNull: true,
  })
  position_id: number;

  @Column({
    allowNull: true,
  })
  salary_range_id: number;

  @Column({
    allowNull: true,
  })
  is_main: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information: CandidateInformation;

  @BelongsTo(() => DFDegree, {
    foreignKey: 'degree_id',
  })
  df_degree: DFDegree;

  @BelongsTo(() => YearOfExperience, {
    foreignKey: 'year_of_experience_id',
  })
  year_of_experience: YearOfExperience;

  @BelongsTo(() => Position, {
    foreignKey: 'position_id',
  })
  df_position: Position;

  @BelongsTo(() => SalaryRange, {
    foreignKey: 'salary_range_id',
  })
  salary_range: SalaryRange;

  @HasMany(() => ApplicationCareer, {
    foreignKey: 'application_id',
  })
  application_career: ApplicationCareer;

  @HasMany(() => ApplicationProvince, {
    foreignKey: 'application_id',
  })
  application_province: ApplicationProvince[];

  @HasMany(() => ApplicationJobType, {
    foreignKey: 'application_id',
  })
  application_job_type: ApplicationJobType[];

  @HasMany(() => WorkExperience, { foreignKey: 'application_id' })
  work_experience: WorkExperience[];

  @HasMany(() => SkillExperience, { foreignKey: 'application_id' })
  skill_experience: SkillExperience[];

  @HasMany(() => EducationExperience, { foreignKey: 'application_id' })
  education_experience: EducationExperience[];

  @HasOne(() => ApplicationCV, { foreignKey: 'application_id' })
  application_cv_file: ApplicationCV;

  @HasOne(() => Referrer, { foreignKey: 'application_id' })
  referrer: Referrer;
}
