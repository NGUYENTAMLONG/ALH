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
import { Gender } from './gender.model';
import { HireRequirement } from './hire-requirement.model';

// Local files

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'hire_requirement_gender',
})
export class HireRequirementGender extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  hire_requirement_id: number;

  @Column({
    allowNull: false,
  })
  gender_id: number;

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

  @BelongsTo(() => Gender, {
    foreignKey: 'gender_id',
  })
  gender: Gender;
}
