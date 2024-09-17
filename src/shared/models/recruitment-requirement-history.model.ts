// Other dependencies
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
import { CandidateInformation } from './candidate-information.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';
import { User } from './user.model';

// Local files

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'recruitment_requirement_history',
})
export class RecruitmentRequirementHistory extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  recruitment_requirement_id: number;

  @Column({
    allowNull: false,
  })
  status: number;

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

  @Column
  candidate_information_id: number;

  @Column
  candidate_recruitment_status: number;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  note: string;

  @BelongsTo(() => RecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @BelongsTo(() => User, {
    foreignKey: 'created_by',
  })
  user: User;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information: CandidateInformation;
}
