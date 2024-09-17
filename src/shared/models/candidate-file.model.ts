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

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'candidate_file',
})
export class CandidateFile extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('voice_recording'));
    },
  })
  voice_recording: string;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('video_file'));
    },
  })
  video_file: string;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('file'));
    },
  })
  file: string;

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
