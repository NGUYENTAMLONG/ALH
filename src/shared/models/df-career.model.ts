import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DFGroupCareer } from './df-group-career.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'df_career',
})
export class DFCareer extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  code: string;

  @Column({
    allowNull: false,
  })
  group_career_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => DFGroupCareer, {
    foreignKey: 'group_career_id',
  })
  group_career: DFGroupCareer;
}
