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
import { CandidateInformation } from './candidate-information.model';
import { DFProvince } from './df-province.model';
import { DFDegree } from './df-degree.model';
import { YearOfExperience } from './year-of-experience.model';
import { SalaryRange } from './salary-range.model';
import { DFCareer } from './df-career.model';
import { CandidateInterestCareer } from './candidate-interest-career.model';
import { Position } from './position.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_interest',
})
export class CandidateInterest extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: true,
  })
  df_degree_id: number;

  @Column({
    allowNull: true,
  })
  year_of_experience_id: number;

  @Column({
    allowNull: true,
  })
  position_id: number;

  @Column({
    allowNull: true,
  })
  salary_range_id: number;

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

  @BelongsTo(() => DFDegree, {
    foreignKey: 'df_degree_id',
  })
  df_degree: DFDegree;

  @BelongsTo(() => YearOfExperience, {
    foreignKey: 'year_of_experience_id',
  })
  year_of_experience: YearOfExperience;

  @BelongsTo(() => Position, {
    foreignKey: 'position_id',
  })
  df_position: Position;

  @BelongsTo(() => SalaryRange, {
    foreignKey: 'salary_range_id',
  })
  salary_range: SalaryRange;

  @HasMany(() => CandidateInterestCareer, {
    foreignKey: 'candidate_interest_id',
  })
  candidate_interest_career: CandidateInterestCareer;
}
