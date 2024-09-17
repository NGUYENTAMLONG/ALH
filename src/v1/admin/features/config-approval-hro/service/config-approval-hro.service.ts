//Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
//Local dependencies
import { sendSuccess } from '@utils/send-success';
import { UpdateConfigApprovalHroDto } from '../dto/update-config-approval-hro.dto';
import { ConfigApprovalHroRepository } from '@repositories/config-approval-hro.repository';

@Injectable()
export class AdminConfigApprovalHroService {
  constructor(
    private readonly configApprovalHroRepository: ConfigApprovalHroRepository,
  ) {}
  async findAll() {
    const configApproval = await this.configApprovalHroRepository.findAll();
    if (configApproval?.length === 0) {
      //init config auto approval
      const initConfig: any = await this.configApprovalHroRepository.create({
        auto_approval: 1,
      });
      configApproval.push(initConfig);
    }
    return sendSuccess({ data: configApproval });
  }

  async update(id: number, dto: UpdateConfigApprovalHroDto) {
    const foundConfig = await this.configApprovalHroRepository.findOne({
      where: {
        id,
      },
    });
    if (!foundConfig) {
      throw new HttpException(
        'Cấu hình tự động duyệt tài khoản HRO không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    await foundConfig.update({ auto_approval: dto.auto_approval });
    return sendSuccess({ msg: 'Cập nhật cấu hình thành công' });
  }
}
