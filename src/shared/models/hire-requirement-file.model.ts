import { getFullUrl } from '@utils/constants';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HireRequirement } from './hire-requirement.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'hire_requirement_file',
})
export class HireRequirementFile extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  hire_requirement_id: number;

  @Column({
    allowNull: false,
    get() {
      return getFullUrl(this.getDataValue('file'));
    },
  })
  file: string;

  @Column
  file_name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => HireRequirement, {
    foreignKey: 'hire_requirement_id',
  })
  hire_requirement: HireRequirement;
}
