import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInformation } from './candidate-information.model';
import { CandidateInterview } from './candidate-interview.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';
import { User } from './user.model';
import { CandidateApply } from './candidate-apply.model';
import { TimelineStatus } from './timeline-status.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_recruitment',
})
export class CandidateRecruitment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  recruitment_requirement_id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: true,
  })
  candidate_info_review_id: number;

  @Column({
    allowNull: false,
  })
  status: number;

  @Column
  note: string;

  @Column({
    allowNull: true,
  })
  schedule: Date;

  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  is_online: number;

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
    as: 'candidate_information',
  })
  candidate_information: CandidateInformation;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_info_review_id',
    as: 'candidate_information_review',
  })
  candidate_infor_review: CandidateInformation;

  @BelongsTo(() => RecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @HasOne(() => CandidateInterview, {
    foreignKey: 'candidate_recruitment_id',
  })
  candidate_interview: CandidateInterview;

  @HasOne(() => CandidateApply, {
    foreignKey: 'candidate_recruitment_id',
  })
  candidate_apply: CandidateApply;

  @BelongsTo(() => User, {
    foreignKey: 'created_by',
  })
  created_user: User;

  @HasMany(() => TimelineStatus, {
    foreignKey: 'candidate_recruitment_id',
  })
  timeline_statuses: TimelineStatus;
}
