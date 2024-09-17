import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInformation } from './candidate-information.model';
import { HireRequirement } from './hire-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_hire_requirement',
})
export class CandidateHireRequirement extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  hire_requirement_id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: false,
  })
  status: number;

  @Column
  note: string;

  @Column({
    allowNull: true,
  })
  created_by: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information: CandidateInformation;

  @BelongsTo(() => HireRequirement, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement: HireRequirement;
}
