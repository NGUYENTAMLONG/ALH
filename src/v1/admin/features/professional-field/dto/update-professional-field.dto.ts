import { PartialType } from '@nestjs/swagger';
import { CreateProfessionalFieldDto } from './create-professional-field.dto';

export class UpdateProfessionalFieldDto extends PartialType(
  CreateProfessionalFieldDto,
) {}
