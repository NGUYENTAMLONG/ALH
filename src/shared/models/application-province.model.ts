import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DFProvince } from './df-province.model';
import { Application } from './application.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'application_province',
})
export class ApplicationProvince extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  application_id: number;

  @Column({
    allowNull: false,
  })
  df_province_id: number;

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

  @BelongsTo(() => DFProvince, {
    foreignKey: 'df_province_id',
  })
  df_province: DFProvince;
}
