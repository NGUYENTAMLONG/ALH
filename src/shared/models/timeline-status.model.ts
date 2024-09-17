// Other dependencies
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
// Local files
import { CandidateRecruitment } from './candidate-recruitment.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'timeline_status',
})
export class TimelineStatus extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_recruitment_id: number;

  @Column({
    allowNull: true,
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

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  modify_date: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => CandidateRecruitment, {
    foreignKey: 'candidate_recruitment_id',
  })
  candidate_recruitment: CandidateRecruitment;
}
