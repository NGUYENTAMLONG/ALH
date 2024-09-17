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
import { WalletHistory } from './wallet-history.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'wallet',
})
export class Wallet extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  user_id: number;

  @Column({
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  })
  balance: number;

  @Column({
    allowNull: true,
    type: DataTypes.BOOLEAN,
  })
  is_active: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => WalletHistory, 'wallet_id')
  wallet_history: WalletHistory;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;
}
