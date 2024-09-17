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
import { RecruitmentRequirement } from './recruitment-requirement.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'user_recruitment_favorite',
})
export class UserRecruitmentFavorite extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @Column({
    allowNull: false,
  })
  recruitment_requirement_id: number;

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

  @BelongsTo(() => RecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement: RecruitmentRequirement;
}
