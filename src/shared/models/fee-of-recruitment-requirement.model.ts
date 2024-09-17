import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { FeeType } from './fee-type.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'fee_of_recruitment_requirement',
})
export class FeeOfRecruitmentRequirement extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  fee_type_id: number;

  @Column
  recruitment_requirement_id: number;

  @Column
  professional_field_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.DECIMAL(18, 0),
  })
  price: number;

  @Column
  type: number;

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

  @BelongsTo(() => FeeType, {
    foreignKey: 'fee_type_id',
  })
  fee_type: FeeType;
}
