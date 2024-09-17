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
  tableName: 'enterprise_data',
})
export class EnterpriseData extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  enterprise_id: number;

  @Column
  enterprise_data_field_code: string;

  @Column
  enterprise_data_field_source_code: string;

  @Column
  value: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
