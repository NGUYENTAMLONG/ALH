// Other dependencies
import { DataTypes } from 'sequelize';
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
import { User } from './user.model';
import { Wallet } from './wallet.model';
import { DFBank } from './df-bank.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'wallet_requirement',
})
export class WalletRequirement extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  user_id: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  wallet_id: number;

  @Column({
    allowNull: false,
    type: DataTypes.FLOAT,
  })
  money: number;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  to_user: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  bank_account: string;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  bank_id: number;

  @Column({
    defaultValue: 1,
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Wallet, { foreignKey: 'wallet_id' })
  wallet: Wallet;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;

  @BelongsTo(() => DFBank, { foreignKey: 'bank_id' })
  bank: DFBank;
}
