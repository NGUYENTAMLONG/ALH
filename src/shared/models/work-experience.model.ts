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
import { CandidateInformation } from './candidate-information.model';
import { Application } from './application.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'work_experience',
})
export class WorkExperience extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  candidate_information_id: number;

  @Column({
    allowNull: true,
  })
  application_id: number;

  @Column
  enterprise_name: string;

  @Column
  position: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  description: string;

  @Column
  start_time: Date;

  @Column
  end_time: Date;

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

  @BelongsTo(() => Application, {
    foreignKey: 'application_id',
  })
  application: Application;
}
