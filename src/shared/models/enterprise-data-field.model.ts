import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EnterpriseDataFieldSource } from './enterprise-data-field-source.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'enterprise_data_field',
})
export class EnterpriseDataField extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  code: string;

  @Column
  data_type: string;

  @Column
  order: number;

  @Column({
    defaultValue: 0,
  })
  is_required: number;

  @Column({
    defaultValue: 1,
  })
  status: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => EnterpriseDataFieldSource, {
    foreignKey: 'code',
    sourceKey: 'code',
  })
  enterprise_data_field_source: EnterpriseDataFieldSource;
}
