import { TEXT } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Application } from './application.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'referrer',
})
export class Referrer extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  application_id: number;

  @Column({
    allowNull: true,
  })
  full_name: string;

  @Column({
    allowNull: true,
  })
  phone_number: string;

  @Column({
    allowNull: true,
  })
  email: string;

  @Column({
    allowNull: true,
    type: TEXT,
  })
  position_input: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Application, {
    foreignKey: 'application_id',
  })
  application: Application;
}
