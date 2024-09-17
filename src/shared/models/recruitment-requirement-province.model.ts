import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DFProvince } from './df-province.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'recruitment_requirement_province',
})
export class RecruitmentRequirementProvince extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  recruitment_requirement_id: number;

  @Column({
    allowNull: false,
  })
  df_province_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => RecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @BelongsTo(() => DFProvince, {
    foreignKey: 'df_province_id',
  })
  df_province: DFProvince;
}
