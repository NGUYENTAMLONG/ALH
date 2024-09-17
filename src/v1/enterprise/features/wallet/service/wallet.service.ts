// Nest dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Local files
import { CandidateInformation } from '@models/candidate-information.model';
import { RecruitmentRequirement } from '@models/recruitment-requirement.model';
import { User } from '@models/user.model';
import { EnterpriseRepository } from '@repositories/enterprise.repository';
import { WalletHistoryRepository } from '@repositories/wallet-history.repository';
import { WalletRepository } from '@repositories/wallet.repository';
import { convertDateTime } from '@utils/date-time';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { Op } from 'sequelize';
import { EnterpriseFilterDetailWalletDto } from '../dto/filter-detail-wallet.dto';

@Injectable()
export class EnterpriseWalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly walletHistoryRepository: WalletHistoryRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
  ) {}

  async getAllHistory(user_id: number, dto: EnterpriseFilterDetailWalletDto) {
    const enterprise = await this.enterpriseRepository.findEnterprise(user_id);

    if (!enterprise) {
      throw new HttpException(
        'Doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }
    const wallet = await this.walletRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!wallet) {
      throw new HttpException(
        'Ví doanh nghiệp không tồn tại trên hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const whereCondition: any = {
      wallet_id: wallet.id,
    };
    if (dto.from_date || dto.to_date) {
      const { fromDate, toDate } = convertDateTime(dto.from_date, dto.to_date);
      whereCondition.created_at = { [Op.between]: [fromDate, toDate] };
    }
    if (dto.mutable_type) {
      whereCondition.mutable_type = dto.mutable_type;
    }
    const options: any = {
      where: whereCondition,
      include: [
        { model: User },
        { model: RecruitmentRequirement },
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: { model: User },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.walletHistoryRepository.count(options);

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const walletHistory = await this.walletHistoryRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({
      data: { wallet, wallet_history: walletHistory },
      paging,
    });
  }
}
