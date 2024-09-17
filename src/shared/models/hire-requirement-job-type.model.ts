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
import { HireRequirement } from './hire-requirement.model';

// Local files

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'hire_requirement_job_type',
})
export class HireRequirementJobType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  hire_requirement_id: number;

  @Column({
    allowNull: false,
  })
  job_type_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => HireRequirement, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement: HireRequirement;
}
