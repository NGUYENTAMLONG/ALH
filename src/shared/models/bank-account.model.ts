import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'bank_account',
})
export class BankAccount extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  user_id: number;

  @Column
  bank_id: number;

  @Column
  account_number: string;

  @Column
  cardholder_name: string;

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
}
