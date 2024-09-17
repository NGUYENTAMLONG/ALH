import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateJobType } from './candidate-job-type.model';
import { JobTypeTime } from './job-type-time.model';
import { JobTypeWorkplace } from './job-type-workplace.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'job_type',
})
export class JobType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  job_type_time_id: number;

  @Column
  job_type_workplace_id: number;

  @Column
  name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => JobTypeTime, { foreignKey: 'job_type_time_id' })
  job_type_time: JobTypeTime;

  @BelongsTo(() => JobTypeWorkplace, { foreignKey: 'job_type_workplace_id' })
  job_type_workplace: JobTypeWorkplace;

  @HasMany(() => CandidateJobType, { foreignKey: 'job_type_id' })
  candidate_job_type: CandidateJobType;
}
