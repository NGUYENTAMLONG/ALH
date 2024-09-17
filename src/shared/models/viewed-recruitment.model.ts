import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DFProvince } from './df-province.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'viewed_recruitment',
})
export class ViewedRecruitment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  recruitment_requirement_id: number;

  @Column({
    allowNull: false,
  })
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => RecruitmentRequirement, {
    foreignKey: 'recruitment_requirement_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
  })
  user: User;
}
