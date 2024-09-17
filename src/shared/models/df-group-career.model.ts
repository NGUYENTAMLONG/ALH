import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DFCareer } from './df-career.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'df_group_career',
})
export class DFGroupCareer extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  code: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => DFCareer, { foreignKey: 'group_career_id' })
  careers: DFCareer;
}
