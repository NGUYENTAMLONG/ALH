// Other dependencies
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

// Local files
import { IS_ACTIVE } from '@utils/constants';
import { AgeGroup } from './age-group.model';
import { DFProvince } from './df-province.model';
import { Gender } from './gender.model';
import { ProfessionalField } from './professional-field.model';
import { RecruitmentJobType } from './recruitment-job-type.model';
import { SalaryRange } from './salary-range.model';
import { YearOfExperience } from './year-of-experience.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'recruitment_template',
})
export class RecruitmentTemplate extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    allowNull: false,
  })
  professional_field_id: number;

  @Column({
    allowNull: false,
  })
  df_province_id: number;

  @Column({
    allowNull: false,
  })
  salary_range_id: number;

  @Column({
    allowNull: false,
  })
  years_of_experience_id: number;

  @Column({
    allowNull: false,
  })
  age_group_id: number;

  @Column({
    allowNull: false,
    comment: 'user id có role là admin',
  })
  created_by: number;

  @Column({
    allowNull: false,
  })
  gender_id: number;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  job_description: string;

  @Column({
    defaultValue: 0,
  })
  recruitment_count: number;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  benefits_and_treatment: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  enterprise_introduction: string;

  @Column({
    allowNull: false,
    comment: '1 - Hoạt động, 2 - Ngừng hoạt động',
    defaultValue: IS_ACTIVE.ACTIVE,
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => ProfessionalField, { foreignKey: 'professional_field_id' })
  professional_field: ProfessionalField;

  @HasMany(() => RecruitmentJobType, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_job_type: RecruitmentJobType[];

  @BelongsTo(() => DFProvince, { foreignKey: 'df_province_id' })
  df_province: DFProvince;

  @BelongsTo(() => YearOfExperience, { foreignKey: 'salary_range_id' })
  year_of_experience: YearOfExperience;

  @BelongsTo(() => Gender, { foreignKey: 'gender_id' })
  gender: Gender;

  @BelongsTo(() => AgeGroup, { foreignKey: 'age_group_id' })
  age_group: AgeGroup;

  @BelongsTo(() => SalaryRange, { foreignKey: 'salary_range_id' })
  salary_range: SalaryRange;
}
