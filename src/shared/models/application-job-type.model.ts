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
import { Application } from './application.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'application_job_type',
})
export class ApplicationJobType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  application_id: number;

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

  @BelongsTo(() => Application, { foreignKey: 'application_id' })
  application: Application;
}
