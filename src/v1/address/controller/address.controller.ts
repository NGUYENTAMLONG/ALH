import { Public } from '@decorators/public.decorator';
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterDistrictDto } from '../dto/filter-distric.dto';
import { FilterProvinceDto } from '../dto/filter-province.dto';
import { FilterWardDto } from '../dto/filter-ward.dto';
import { AddressService } from '../service/address.service';

@ApiTags('[ADDRESS]')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Public()
  @Get('ward')
  @ApiOperation({
    security: [{}],
  })
  async findAllWard(@Query(new ValidationPipe()) dto: FilterWardDto) {
    return await this.addressService.findAllWard(dto);
  }

  @Public()
  @Get('district')
  @ApiOperation({
    security: [{}],
  })
  async findAllDistrict(@Query(new ValidationPipe()) dto: FilterDistrictDto) {
    return await this.addressService.findAllDistrict(dto);
  }

  @Public()
  @Get('province')
  @ApiOperation({
    security: [{}],
  })
  async findAllProvince(@Query() dto: FilterProvinceDto) {
    return await this.addressService.findAllProvince(dto);
  }
}
