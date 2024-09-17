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
  tableName: 'config_message',
})
export class ConfigMessage extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  type: number;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  time: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  morning_time: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  afternoon_time: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
