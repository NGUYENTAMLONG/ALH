import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { HireRequirementProfessionalField } from './hire-requirement-professional-field.model';
import { InterestList } from './interest-list.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'professional_field',
})
export class ProfessionalField extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => InterestList, {
    foreignKey: 'professional_field_id',
  })
  interest_list: InterestList;

  @HasOne(() => HireRequirementProfessionalField, {
    foreignKey: 'professional_field_id',
  })
  hire_requirement_professional_field: HireRequirementProfessionalField;
}
