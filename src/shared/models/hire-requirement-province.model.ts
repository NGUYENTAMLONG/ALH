// Other dependencies
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
import { HireRequirement } from './hire-requirement.model';

// Local files

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'hire_requirement_province',
})
export class HireRequirementProvince extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  hire_requirement_id: number;

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

  @BelongsTo(() => DFProvince, {
    foreignKey: 'df_province_id',
  })
  df_province: DFProvince;

  @BelongsTo(() => HireRequirement, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement: HireRequirement;
}
