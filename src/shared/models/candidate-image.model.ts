import { getFullUrl } from '@utils/constants';
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

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'candidate_image',
})
export class CandidateImage extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  candidate_information_id: number;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('image_file'));
    },
  })
  image_file: string;

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
