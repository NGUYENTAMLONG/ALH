import { INTEREST_LIST_STATUS } from '@utils/constants';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CandidateInformation } from './candidate-information.model';
import { Enterprise } from './enterprise.model';
import { InterestListJobType } from './interest-list-job-type.model';
import { InterestListProvince } from './interest-list-province.model';
import { ProfessionalField } from './professional-field.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'interest_list',
})
export class InterestList extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;
  @Column({
    allowNull: false,
  })
  candidate_information_id: number;
  @Column({
    allowNull: false,
  })
  enterprise_id: number;
  @Column({
    allowNull: true,
  })
  professional_field_id: number;
  @Column({
    allowNull: true,
  })
  hire_price: number;
  @Column({
    allowNull: false,
    defaultValue: INTEREST_LIST_STATUS.WAITING_APPROVE,
  })
  status: number;

  @Column
  start_time: Date;

  @Column
  end_time: Date;

  @Column
  note: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Enterprise, { foreignKey: 'enterprise_id' })
  enterprise: Enterprise;

  @BelongsTo(() => CandidateInformation, {
    foreignKey: 'candidate_information_id',
  })
  candidate_information: CandidateInformation;

  @BelongsTo(() => ProfessionalField, {
    foreignKey: 'professional_field_id',
  })
  professional_field: ProfessionalField;

  @HasMany(() => InterestListProvince, {
    foreignKey: 'interest_list_id',
  })
  interest_list_province: InterestListProvince;

  @HasMany(() => InterestListJobType, {
    foreignKey: 'interest_list_id',
  })
  interest_list_job_type: InterestListJobType;
}
