// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local files
import { CandidateInformation } from '@models/candidate-information.model';
import { Enterprise } from '@models/enterprise.model';
import { User } from '@models/user.model';
import { TrackingLogRepository } from '@repositories/tracking-log.repository';
import { paginateData } from '@utils/pagingnation';
import { sendSuccess } from '@utils/send-success';
import { AdminFilterTrackingDto } from '../dto/filter-tracking.dto';

@Injectable()
export class AdminTrackingService {
  constructor(private readonly trackingLogRepository: TrackingLogRepository) {}

  async findAll(dto: AdminFilterTrackingDto) {
    const options: any = {
      include: [
        {
          model: User,
          include: {
            model: Enterprise,
            as: 'user',
          },
        },
        {
          model: CandidateInformation,
          as: 'candidate_information',
          include: {
            model: User,
          },
        },
      ],
      order: [['id', 'DESC']],
    };
    const count = await this.trackingLogRepository.count();

    const { current_page, page_size, total_count, offset } = paginateData(
      count,
      dto.page,
      dto.limit,
    );

    options.offset = offset;
    options.limit = page_size;

    const trackingLog = await this.trackingLogRepository.findAll(options);
    const paging = {
      total_count,
      current_page,
      limit: page_size,
      offset,
    };
    return sendSuccess({ data: trackingLog, paging });
  }
}
