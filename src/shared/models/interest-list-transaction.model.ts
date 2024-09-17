import { INTEREST_LIST_STATUS } from '@utils/constants';
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
import { Enterprise } from './enterprise.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'interest_list_transaction',
})
export class InterestListTransaction extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;
  @Column({
    allowNull: false,
  })
  candidate_information_id: number;
  @Column({
    allowNull: false,
  })
  interest_list_id: number;

  @Column({
    allowNull: false,
  })
  enterprise_id: number;
  @Column({
    allowNull: false,
    defaultValue: INTEREST_LIST_STATUS.WAITING_APPROVE,
  })
  status: number;

  @Column
  note: string;

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

  @BelongsTo(() => Enterprise, {
    foreignKey: 'enterprise_id',
  })
  enterprise: Enterprise;
}
