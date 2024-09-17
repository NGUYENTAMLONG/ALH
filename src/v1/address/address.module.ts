// Nest dependencies
import { Module } from '@nestjs/common';

// Local files
import { DFDistrictRepository } from '@repositories/df-district.repository';
import { DFProvinceRepository } from '@repositories/df-province.repository';
import { DFWardRepository } from '@repositories/df-ward.repository';
import { AddressController } from './controller/address.controller';
import { AddressService } from './service/address.service';

@Module({
  controllers: [AddressController],
  providers: [
    AddressService,
    DFProvinceRepository,
    DFDistrictRepository,
    DFWardRepository,
  ],
})
export class AddressModule {}
