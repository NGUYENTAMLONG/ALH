// Other dependencies
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
  tableName: 'df_district',
})
export class DFDistrict extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  df_province_id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column
  value: string;

  @Column
  prefix: string;

  @Column
  is_active: number;

  @Column
  create_by: number;

  @Column
  update_by: number;

  @Column
  delete_by: number;

  @Column({
    allowNull: false,
  })
  version: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
