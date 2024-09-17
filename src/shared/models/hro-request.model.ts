import { REGISTER_STATUS } from '@utils/constants';
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
  tableName: 'hro_request',
})
export class HroRequest extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @Column({
    allowNull: false,
    defaultValue: REGISTER_STATUS.PENDING,
  })
  status: number;

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
