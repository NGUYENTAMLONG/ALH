// Other dependencies
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
import { getFullUrl } from '@utils/constants';
import { User } from './user.model';
import { Application } from './application.model';

@Table({
  timestamps: true,
  paranoid: false,
  tableName: 'application_cv',
})
export class ApplicationCV extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  application_id: number;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('file'));
    },
  })
  file: string;

  @Column
  file_name: string;

  @Column({
    allowNull: true,
  })
  is_main: number;

  // @Column({
  //   allowNull: true,
  // })
  // created_by: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Application, {
    foreignKey: 'application_id',
  })
  application: Application;

  // @BelongsTo(() => User, {
  //   foreignKey: 'created_by',
  // })
  // created_user: User;
}
