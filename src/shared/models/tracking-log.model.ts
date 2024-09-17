// Other dependencies
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInformation } from './candidate-information.model';
import { User } from './user.model';
// Local files

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'tracking_log',
})
export class TrackingLog extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @Column(DataType.JSON)
  data: any;

  @Column
  type: number;

  @Column
  candidate_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
  })
  user: User;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_id',
  })
  candidate_information: CandidateInformation;
}
