import {
  Column,
  CreatedAt,
  DeletedAt,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HireRequirementGender } from './hire-requirement-gender.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'gender',
})
export class Gender extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasOne(() => HireRequirementGender, {
    foreignKey: 'gender_id',
  })
  hire_requirement_gender: HireRequirementGender;
}
