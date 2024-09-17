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
import { CandidateHireRequirement } from './candidate-hire-requirement.model';
import { Enterprise } from './enterprise.model';
import { HireRequirementFile } from './hire-requirement-file.model';
import { HireRequirementGender } from './hire-requirement-gender.model';
import { HireRequirementJobType } from './hire-requirement-job-type.model';
import { HireRequirementProfessionalField } from './hire-requirement-professional-field.model';
import { HireRequirementProvince } from './hire-requirement-province.model';
import { HireRequirementResponsible } from './hire-requirement-responsible.model';
import { User } from './user.model';
import { YearOfExperience } from './year-of-experience.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'hire_requirement',
})
export class HireRequirement extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  enterprise_id: number;

  @Column({
    allowNull: true,
  })
  years_of_experience_id: number;

  @Column({
    allowNull: true,
  })
  age_group_id: number;

  @Column({
    allowNull: true,
  })
  created_by: number;

  @Column
  implementation_sale_id: number;

  @Column({
    allowNull: true,
  })
  name: string;

  @Column({
    allowNull: true,
  })
  code: string;

  @Column({
    allowNull: true,
  })
  recruitment_count: number;

  @Column({
    allowNull: true,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_all_province: number;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  note: string;

  @Column({
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  type_on_call: number;

  @Column({
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  type_on_hour: number;

  @Column({
    allowNull: true,
  })
  count: number;

  @Column({
    allowNull: true,
    type: DataType.DECIMAL(18, 0),
  })
  price: number;

  @Column({
    allowNull: true,
    type: DataType.DECIMAL(18, 0),
  })
  total_price: number;

  @Column({
    type: DataType.DECIMAL(18, 0),
  })
  budget_min: number;

  @Column({
    type: DataType.DECIMAL(18, 0),
  })
  budget_max: number;

  @Column({
    allowNull: false,
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Enterprise, { foreignKey: 'enterprise_id' })
  enterprise: Enterprise;

  @BelongsTo(() => User, { foreignKey: 'implementation_sale_id' })
  implementation_sale: User;

  @HasMany(() => HireRequirementProfessionalField, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement_professional_field: HireRequirementProfessionalField;

  @HasMany(() => HireRequirementProvince, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement_province: HireRequirementProvince;

  @BelongsTo(() => YearOfExperience, { foreignKey: 'years_of_experience_id' })
  year_of_experience: YearOfExperience;

  @BelongsTo(() => AgeGroup, { foreignKey: 'age_group_id' })
  age_group: AgeGroup;

  @HasMany(() => HireRequirementGender, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement_gender: HireRequirementGender;

  @HasMany(() => HireRequirementResponsible, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement_responsible: HireRequirementResponsible;

  @HasMany(() => HireRequirementJobType, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement_job_type: HireRequirementJobType;

  @HasMany(() => CandidateHireRequirement, {
    foreignKey: 'hire_requirement_id',
  })
  candidate_hire_requirement: CandidateHireRequirement;

  @HasMany(() => HireRequirementFile, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement_file: HireRequirementFile;
}
