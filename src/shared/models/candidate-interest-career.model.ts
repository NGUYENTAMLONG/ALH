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

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_interest_career',
})
export class CandidateInterestCareer extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_interest_id: number;

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

  @BelongsTo(() => CandidateInterest, {
    foreignKey: 'candidate_interest_id',
  })
  candidate_interest: CandidateInterest;

  @BelongsTo(() => DFCareer, {
    foreignKey: 'df_career_id',
  })
  df_career: DFCareer;
}
