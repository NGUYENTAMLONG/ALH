import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { InterestList } from './interest-list.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'interest_list_job_type',
})
export class InterestListJobType extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  interest_list_id: number;

  @Column({
    allowNull: false,
  })
  job_type_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => InterestList, {
    foreignKey: 'interest_list_id',
  })
  interest_list: InterestList;
}
