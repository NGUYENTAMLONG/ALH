import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInterest } from './candidate-interest.model';
import { DFCareer } from './df-career.model';
import { Application } from './application.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'application_career',
})
export class ApplicationCareer extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  application_id: number;

  @Column({
    allowNull: false,
  })
  df_career_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Application, {
    foreignKey: 'application_id',
  })
  application: Application;

  @BelongsTo(() => DFCareer, {
    foreignKey: 'df_career_id',
  })
  df_career: DFCareer;
}
