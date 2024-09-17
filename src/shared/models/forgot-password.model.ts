import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'forgot_password',
})
export class ForgotPassword extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    comment: 'FK bảng user',
  })
  user_id: number;

  @Column
  code: string;

  @Column({
    comment: 'Trạng thái 1: Chưa sử dụng, 0: Đã sử dụng',
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
