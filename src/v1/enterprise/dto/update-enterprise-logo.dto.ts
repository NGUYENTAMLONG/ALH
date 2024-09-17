import { ApiProperty } from '@nestjs/swagger';

export class UpdateEnterpriseLogoDto {
  @ApiProperty({
    required: true,
    example: 'public/files/1696044589áº£nh nhÃ¢n viÃªn sale.jpg',
  })
  logo?: string | null;
}
