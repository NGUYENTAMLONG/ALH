import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInformation } from './candidate-information.model';
import { HireRequirement } from './hire-requirement.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'year_of_experience',
})
export class YearOfExperience extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  min_years: number;

  @Column({
    allowNull: true,
  })
  max_years: number;

  @Column
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => CandidateInformation, {
    foreignKey: 'years_of_experience_id',
  })
  candidate_information: CandidateInformation;

  @HasMany(() => RecruitmentRequirement, {
    foreignKey: 'years_of_experience_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @HasOne(() => HireRequirement, {
    foreignKey: 'years_of_experience_id',
  })
  hire_requirement: HireRequirement;
}
