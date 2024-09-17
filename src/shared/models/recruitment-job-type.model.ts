import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { JobType } from './job-type.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'recruitment_job_type',
})
export class RecruitmentJobType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  recruitment_requirement_id: number;

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
}
