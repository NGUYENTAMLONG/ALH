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
import { CandidateInformation } from './candidate-information.model';
import { CandidateApply } from './candidate-apply.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'candidate_information_file',
})
export class CandidateInformationFile extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
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
}
