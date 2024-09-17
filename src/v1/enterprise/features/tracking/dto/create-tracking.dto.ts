import { IsNotEmpty, IsOptional } from 'class-validator';
export class EnterpriseCreateTrackingDto {
  @IsNotEmpty()
  candidate_id: number;

  @IsOptional()
  age_group_ids: string;

  @IsOptional()
  df_province_ids: string;

  @IsOptional()
  professional_field_ids: string;

  @IsOptional()
  gender_ids: string;

  @IsOptional()
  job_type_ids: string;

  @IsOptional()
  years_of_experience_ids: string;
}

// export class EnterpriseCreateTrackingDto {
//   @ApiProperty({
//     required: true,
//     description: 'Data checking',
//     example: {
//       age_group_ids: '1,2,3,4,5',
//       df_province_ids: '101',
//       professional_field_ids: '1',
//       gender_ids: '1',
//       job_type_ids: '1',
//       years_of_experience_ids: '1',
//     },
//   })
//   @ValidateNested()
//   @Type(() => DataFilter)
//   data: DataFilter;
// }
