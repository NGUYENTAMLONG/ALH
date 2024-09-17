import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { DFCareer } from './df-career.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'user_career_favorite',
})
export class UserCareerFavorite extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @Column({
    allowNull: false,
  })
  df_career_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
  })
  user: User;

  @BelongsTo(() => DFCareer, {
    foreignKey: 'df_career_id',
  })
  df_career: DFCareer;
}
