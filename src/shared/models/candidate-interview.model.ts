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
import { CandidateRecruitment } from './candidate-recruitment.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'candidate_interview',
})
export class CandidateInterview extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  df_province_id: number;

  @Column({
    allowNull: false,
  })
  candidate_recruitment_id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: false,
  })
  phone_number: string;

  @Column({
    allowNull: false,
  })
  interviewer: string;

  @Column({
    allowNull: true,
  })
  is_online: number;

  @Column
  schedule: Date;

  @Column({
    allowNull: false,
  })
  address: string;

  @Column
  note: string;

  @Column
  email: string;

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

  @BelongsTo(() => CandidateRecruitment, {
    foreignKey: 'candidate_recruitment_id',
  })
  candidate_recruitment: CandidateRecruitment;
}
