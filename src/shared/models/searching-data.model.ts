// Other dependencies
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
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'searching_data',
})
export class SearchingData extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  user_id: number;

  //Ex:
  // '{
  //   search: "Nhân viên",
  //   province_ids: [1,2],
  //   career_ids: [1,3],
  //   years_of_experience_ids:[1],
  //   salary_range_ids:[1,2],
  //   professional_field_ids: [1,2],
  //   position_ids: [1,2]
  //   }'
  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  metadata: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;
}
