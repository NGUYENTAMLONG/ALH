// Other dependencies
import {
  BelongsTo,
  Column,
  Model,
  Table,
  UpdatedAt,
  CreatedAt,
  DeletedAt,
} from 'sequelize-typescript';
// Local files
import { User } from './user.model';
import { getFullUrl } from '@utils/constants';
import { CandidateInformation } from './candidate-information.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'cv_uploaded', //CV tải lên từ máy
})
export class CVUploaded extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  candidate_information_id: number;

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
  is_main: number;

  @Column({
    allowNull: true,
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @Column({
    allowNull: true,
  })
  created_by: number;

  @Column({
    allowNull: true,
  })
  candidate_info_review_id: number;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
    as: 'candidate_information',
  })
  candidate_information: CandidateInformation;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_info_review_id',
    as: 'candidate_infor_review',
  })
  candidate_infor_reivew: CandidateInformation;

  // @BelongsTo(() => User, {
  //   foreignKey: 'created_by',
  // })
  // created_user: User;
}
