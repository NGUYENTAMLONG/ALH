import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EnterpriseDataField } from './enterprise-data-field.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'enterprise_data_field_source',
})
export class EnterpriseDataFieldSource extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  code: string;

  @Column
  item_code: string;

  @Column
  value: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => EnterpriseDataField, {
    foreignKey: 'code',
  })
  enterprise_data_field: EnterpriseDataField;
}
