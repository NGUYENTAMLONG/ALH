// Other dependencies
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
// Local files
import { getFullUrl } from '@utils/constants';
import { CandidateApply } from './candidate-apply.model';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'candidate_apply_file',
})
export class CandidateApplyFile extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_apply_id: number;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('file'));
    },
  })
  file: string;

  @Column
  file_name: string;

  @Column({
    allowNull: true,
  })
  type: number;

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

  @BelongsTo(() => CandidateApply, {
    foreignKey: 'candidate_apply_id',
  })
  candidate_apply: CandidateApply;

  @BelongsTo(() => User, {
    foreignKey: 'created_by',
  })
  created_user: User;
}
