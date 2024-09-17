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
import { JobType } from './job-type.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_job_type',
})
export class CandidateJobType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: false,
  })
  job_type_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => JobType, { foreignKey: 'job_type_id' })
  job_type: JobType;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information: CandidateInformation;
}
