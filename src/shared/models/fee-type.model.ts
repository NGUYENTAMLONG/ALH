import {
  Column,
  CreatedAt,
  DeletedAt,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { FeeOfRecruitmentRequirement } from './fee-of-recruitment-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'fee_type',
})
export class FeeType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  price: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasOne(() => FeeOfRecruitmentRequirement, {
    foreignKey: 'fee_type_id',
  })
  fee_of_recruitment_requirement: FeeOfRecruitmentRequirement;
}
