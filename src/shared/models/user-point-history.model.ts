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
import { UserPoint } from './user-point.model';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'user_point_history',
})
export class UserPointHistory extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  user_point_id: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  type: number;

  @Column({
    allowNull: true,
    type: DataTypes.DECIMAL(12, 0),
  })
  value: number;

  @Column({
    allowNull: true,
    type: DataTypes.DECIMAL(12, 0),
  })
  current_point: number;
  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  mutable_type: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  recruitment_requirement_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  candidate_information_id: number;

  @Column({
    allowNull: true,
    type: DataTypes.INTEGER,
  })
  created_by: number;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  note: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => UserPoint, 'user_point_id')
  user_point: UserPoint;

  @BelongsTo(() => User, {
    foreignKey: 'created_by',
  })
  user: User;

  @BelongsTo(() => RecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information: CandidateInformation;
}
