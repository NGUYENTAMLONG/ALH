// Other dependencies
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
// Local files
import { CandidateInformation } from './candidate-information.model';
import { CandidateRecruitment } from './candidate-recruitment.model';
import { User } from './user.model';
import { CandidateApplyFile } from './candidate-apply-file.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'candidate_apply',
})
export class CandidateApply extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    allowNull: false,
  })
  candidate_recruitment_id: number;

  @Column({
    allowNull: true,
  })
  created_by: number;

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

  @HasMany(() => CandidateApplyFile, {
    foreignKey: 'candidate_apply_id',
  })
  candidate_apply_file: CandidateApplyFile;

  @BelongsTo(() => User, {
    foreignKey: 'created_by',
  })
  created_user: User;
}
