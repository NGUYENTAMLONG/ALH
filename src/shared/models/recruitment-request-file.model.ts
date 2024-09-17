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
import { Enterprise } from './enterprise.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'recruitment_request_file',
})
export class RecruitmentRequestFile extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  enterprise_id: number;

  @Column({
    comment: 'Công thức tạo code: YC + 0000 + id',
  })
  code: string;

  @Column({
    allowNull: false,
    get() {
      return getFullUrl(this.getDataValue('file'));
    },
  })
  file: string;

  @Column({
    allowNull: false,
    comment:
      'Định nghĩa các tạng thái: 1 - Đang xử lý, 2 - Đang chờ, 3 - Từ trối, 4 - Đang xử lý',
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Enterprise, { foreignKey: 'enterprise_id' })
  enterprise: Enterprise;
}
