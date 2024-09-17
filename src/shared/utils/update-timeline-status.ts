import { TimelineStatus } from '@models/timeline-status.model';

export const updateTimelineStatus = async (
  candidate_recruitment_id: number,
  candidate_information_id: number,
  candidate_info_review_id: number,
  status: number,
) => {
  await TimelineStatus.create({
    candidate_recruitment_id,
    candidate_information_id,
    candidate_info_review_id,
    status,
    modify_date: new Date(),
  });
};
