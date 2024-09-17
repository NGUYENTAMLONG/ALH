import { BANNER_STATUS, BANNER_TYPE, getFullUrl } from '@utils/constants';
import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'banner',
})
export class Banner extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  code: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  title: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  url: string;

  @Column({
    allowNull: false,
    defaultValue: BANNER_TYPE.BANNER,
  })
  type: number;

  @Column({
    allowNull: false,
    defaultValue: BANNER_STATUS.ACTIVE,
  })
  status: number;

  @Column({
    allowNull: true,
  })
  to_role: number;

  @Column({
    allowNull: true,
  })
  navigate_id: number;

  @Column({
    allowNull: true,
  })
  navigate_link: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
