import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { JobType } from './job-type.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'job_type_workplace',
})
export class JobTypeWorkplace extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => JobType, { foreignKey: 'job_type_workplace_id' })
  job_type: JobType;
}
