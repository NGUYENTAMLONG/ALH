import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInformation } from './candidate-information.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'salary_range',
})
export class SalaryRange extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  min_salary: number;

  @Column({
    allowNull: true,
  })
  max_salary: number;

  @Column
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => CandidateInformation, {
    foreignKey: 'salary_range_id',
  })
  candidate_information: CandidateInformation;
}
