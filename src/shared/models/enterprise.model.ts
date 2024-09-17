// Other dependencies
import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

// Local files
import { IS_ACTIVE, getFullUrl } from '@utils/constants';
import { EnterpriseAddress } from './enterprise-address.model';
import { HireRequirement } from './hire-requirement.model';
import { InterestListTransaction } from './interest-list-transaction.model';
import { InterestList } from './interest-list.model';
import { RecruitmentRequestFile } from './recruitment-request-file.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'enterprise',
})
export class Enterprise extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: true,
  })
  position: string;

  @Column({
    allowNull: false,
    comment: 'PK bảng user',
  })
  user_id: number;

  @Column({
    allowNull: true,
    comment: 'PK bảng professional_field',
  })
  professional_field_id: number;

  @Column
  name: string;

  @Column({
    get() {
      return getFullUrl(this.getDataValue('logo'));
    },
  })
  logo: string;

  @Column({
    type: DataTypes.TEXT,
  })
  description: string;

  @Column({
    allowNull: false,
    defaultValue: IS_ACTIVE.ACTIVE,
  })
  status: number;

  @Column({
    type: DataTypes.TEXT,
  })
  professional_field_text: string;

  @Column
  employee_count: number;

  @Column
  responsible_sale_id: number;

  @Column
  tax_code: string;

  @Column
  website: string;

  @Column
  linkedin: string;

  @Column
  facebook: string;

  @Column
  salesperson: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @Column({
    allowNull: true,
    comment: 'user id người tạo',
  })
  created_by: number;

  @HasOne(() => EnterpriseAddress, { foreignKey: 'enterprise_id' })
  enterprise_address: EnterpriseAddress;

  @HasMany(() => RecruitmentRequirement, { foreignKey: 'enterprise_id' })
  recruitment_requirement: RecruitmentRequirement;

  @HasMany(() => RecruitmentRequestFile, { foreignKey: 'enterprise_id' })
  recruitment_request_file: RecruitmentRequestFile;

  @HasMany(() => InterestList, { foreignKey: 'enterprise_id' })
  interest_list: InterestList;

  @HasMany(() => InterestListTransaction, { foreignKey: 'enterprise_id' })
  interest_list_transaction: InterestListTransaction;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;

  @HasOne(() => HireRequirement, { foreignKey: 'enterprise_id' })
  hire_requirement: HireRequirement;

  @HasMany(() => User, { foreignKey: 'enterprise_id' })
  employees: User;
}
