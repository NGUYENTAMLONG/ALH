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
import { Application } from './application.model';
import { DataTypes } from 'sequelize';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'education_experience',
})
export class EducationExperience extends Model {
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
  school_name: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  major: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
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
