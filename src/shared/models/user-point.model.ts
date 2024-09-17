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
import { UserPointHistory } from './user-point-history.model';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'user_point',
})
export class UserPoint extends Model {
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
  point: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => UserPointHistory, 'user_point_id')
  user_point_history: UserPointHistory;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;
}
