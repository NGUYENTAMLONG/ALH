// Other dependencies
import * as bcrypt from 'bcrypt';
import {
  BeforeCreate,
  BeforeUpdate,
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

// File locals
import { GENDER, getFullUrl } from '@utils/constants';
import { DataTypes } from 'sequelize';
import { BankAccount } from './bank-account.model';
import { CandidateInformation } from './candidate-information.model';
import { CandidateRecruitment } from './candidate-recruitment.model';
import { Enterprise } from './enterprise.model';
import { HireRequirementResponsible } from './hire-requirement-responsible.model';
import { HireRequirement } from './hire-requirement.model';
import { HroRequest } from './hro-request.model';
import { RecruitmentRequirementHistory } from './recruitment-requirement-history.model';
import { RecruitmentRequirementHro } from './recruitment-requirement-hro.model';
import { RecruitmentRequirementImplementation } from './recruitment-requirement-implementation.model';
import { RecruitmentRequirement } from './recruitment-requirement.model';
import { TrackingLog } from './tracking-log.model';
import { UserPointHistory } from './user-point-history.model';
import { UserPoint } from './user-point.model';
import { WalletHistory } from './wallet-history.model';
import { Wallet } from './wallet.model';
import { SearchingData } from './searching-data.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'user',
})
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    comment: 'PK bảng gender',
    defaultValue: GENDER.NO_UPDATE, // Chưa cập nhật giới tính
  })
  gender_id: number;

  @Column({
    allowNull: false,
    comment: 'PK bảng role',
  })
  role_id: number;

  @Column({
    allowNull: false,
  })
  full_name: string;

  @Column({
    allowNull: true,
  })
  email: string;

  @Column({
    allowNull: true,
  })
  phone_number: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT,
  })
  token: string;

  @Column
  alternate_phone: string;

  @Column({
    allowNull: false,
  })
  password: string;

  @Column({
    defaultValue: null,
    get() {
      return getFullUrl(this.getDataValue('avatar'));
    },
  })
  avatar: string;

  @Column
  date_of_birth: Date;

  @Column({
    defaultValue: 1,
  })
  status: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: 1,
  })
  is_receive_notification: number;

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  })
  is_save_searching: number;

  @Column({
    allowNull: true,
    type: DataTypes.NUMBER,
  })
  is_real_candidate: number;

  @Column({
    allowNull: true,
    type: DataTypes.NUMBER,
  })
  is_real_collaborator: number;

  @Column({
    allowNull: true,
    comment: 'PK bảng enterprise',
  })
  enterprise_id: number;

  @Column
  created_by: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasOne(() => Enterprise, { foreignKey: 'user_id' })
  enterprise: Enterprise;

  @HasOne(() => CandidateInformation, {
    foreignKey: 'user_id',
  })
  candidate_information: CandidateInformation;

  @HasOne(() => TrackingLog, {
    foreignKey: 'user_id',
  })
  tracking_log: TrackingLog;

  @HasOne(() => RecruitmentRequirementHistory, {
    foreignKey: 'created_by',
  })
  recruitment_requirement_history: RecruitmentRequirementHistory;

  @HasOne(() => WalletHistory, {
    foreignKey: 'created_by',
  })
  wallet_history: WalletHistory;

  @HasOne(() => UserPointHistory, {
    foreignKey: 'created_by',
  })
  user_point_history: UserPointHistory;

  @HasMany(() => CandidateRecruitment, {
    foreignKey: 'created_by',
  })
  candidate_recruitment: CandidateRecruitment;

  @HasMany(() => RecruitmentRequirement, {
    foreignKey: 'responsible_sale_id',
  })
  recruitment_requirement: RecruitmentRequirement;

  @HasMany(() => RecruitmentRequirementImplementation, {
    foreignKey: 'user_id',
  })
  recruitment_requirement_implementation: RecruitmentRequirementImplementation;

  @HasOne(() => RecruitmentRequirementHro, {
    foreignKey: 'user_id',
  })
  recruitment_requirement_hro: RecruitmentRequirementHro;

  @HasOne(() => BankAccount, {
    foreignKey: 'user_id',
  })
  bank_account: BankAccount;

  @HasOne(() => HroRequest, {
    foreignKey: 'user_id',
  })
  hro_request: HroRequest;

  @HasOne(() => Wallet, { foreignKey: 'user_id' })
  wallet: Wallet;

  @HasOne(() => UserPoint, { foreignKey: 'user_id' })
  user_point: UserPoint;

  @HasOne(() => SearchingData, { foreignKey: 'user_id' })
  searching_data: SearchingData;

  @HasOne(() => HireRequirement, { foreignKey: 'implementation_sale_id' })
  hire_requirement: HireRequirement;

  @HasOne(() => HireRequirementResponsible, { foreignKey: 'user_id' })
  hire_requirement_responsible: HireRequirementResponsible;

  @BelongsTo(() => Enterprise, { foreignKey: 'enterprise_id' })
  work_for_enterprise: Enterprise;

  @BeforeCreate
  static async hashPassword(instance: User) {
    console.log(instance.password);

    const rounds = 10;

    const salt = await bcrypt.genSalt(rounds);
    instance.password = await bcrypt.hash(instance.password.toString(), salt);
  }

  @BeforeUpdate
  static async resetPassword(instance: User) {
    if (instance.changed('password')) {
      const rounds = 10;
      const salt = await bcrypt.genSalt(rounds);
      instance.password = await bcrypt.hash(instance.password.toString(), salt);
    }
  }
}
