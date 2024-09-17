// Other dependencies
import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
// Local files

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'notification',
})
export class Notification extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @Column(DataType.JSON)
  data: any;

  @Column
  title: string;

  @Column
  content: string;

  @Column
  is_read: number;

  @Column
  is_push: number;

  @Column
  type: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
