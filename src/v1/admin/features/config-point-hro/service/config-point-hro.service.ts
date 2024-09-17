//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//Local dependencies
import { ConfigPointHroRepository } from '@repositories/config-point-hro.repository';
import { sendSuccess } from '@utils/send-success';
import { UpdateConfigPointHroDto } from '../dto/update-config-point-hro.dto';

@Injectable()
export class AdminConfigPointHroService {
  constructor(
    private readonly configPointHroRepository: ConfigPointHroRepository,
  ) {}
  async findAll() {
    const configPoints = await this.configPointHroRepository.findAll();
    return sendSuccess({ data: configPoints });
  }

  async update(id: number, dto: UpdateConfigPointHroDto) {
    const foundConfig = await this.configPointHroRepository.findOne({
      where: {
        id,
      },
    });
    if (!foundConfig) {
      throw new HttpException(
        'Cấu hình điểm HRO không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await foundConfig.update({ point: dto.point });
    return sendSuccess({ msg: 'Cập nhật cấu hình thành công' });
  }
}
