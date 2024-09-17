// Other dependencies
import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateProvince } from './candidate-province.model';
import { HireRequirementProvince } from './hire-requirement-province.model';
import { RecruitmentRequirementProvince } from './recruitment-requirement-province.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'df_province',
})
export class DFProvince extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column
  value: string;

  @Column
  prefix: string;

  @Column
  is_active: number;

  @Column
  create_by: number;

  @Column
  update_by: number;

  @Column
  delete_by: number;

  @Column({
    allowNull: false,
  })
  version: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => CandidateProvince, {
    foreignKey: 'df_province_id',
  })
  candidate_province: CandidateProvince;

  @HasOne(() => RecruitmentRequirementProvince, {
    foreignKey: 'df_province_id',
  })
  recruitment_requirement_province: RecruitmentRequirementProvince;

  @HasOne(() => HireRequirementProvince, {
    foreignKey: 'df_province_id',
  })
  hire_requirement_province: HireRequirementProvince;
}
