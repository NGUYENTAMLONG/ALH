// Other dependencies
import { IS_ACTIVE } from '@utils/constants';
import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

// Local files
import { DFDistrict } from './df-district.model';
import { DFProvince } from './df-province.model';
import { DFWard } from './df-ward.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'enterprise_address',
})
export class EnterpriseAddress extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
    comment: 'PK bảng enterprise',
  })
  enterprise_id: number;

  @Column({
    allowNull: true,
    comment: 'PK bảng df_province',
  })
  df_province_id: number;

  @Column({
    allowNull: true,
    comment: 'PK bảng df_district',
  })
  df_district_id: number;

  @Column({
    allowNull: true,
    comment: 'PK bảng df_ward',
  })
  df_ward_id: number;

  @Column
  name: string;

  @Column({
    defaultValue: IS_ACTIVE.INACTIVE,
  })
  is_default: number;

  @Column({
    type: DataTypes.TEXT,
  })
  address: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => DFProvince, { foreignKey: 'df_province_id' })
  province: DFProvince;

  @BelongsTo(() => DFDistrict, { foreignKey: 'df_district_id' })
  district: DFDistrict;

  @BelongsTo(() => DFWard, { foreignKey: 'df_ward_id' })
  ward: DFWard;
}
