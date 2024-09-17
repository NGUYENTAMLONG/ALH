import {
  Column,
  CreatedAt,
  DeletedAt,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HireRequirement } from './hire-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'age_group',
})
export class AgeGroup extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  min_age: number;

  @Column({
    allowNull: false,
  })
  max_age: number;

  @Column
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasOne(() => HireRequirement, {
    foreignKey: 'age_group_id',
  })
  hire_requirement: HireRequirement;
}
