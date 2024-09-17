// Local files
import { configService } from '@services/config.service';

export function getFullUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (!path.startsWith('http')) {
    return `${configService.getEnv('APP_DOMAIN')}/${path}`;
  }
  return path;
}

export const ROLE = {
  ADMIN: 1,
  ENTERPRISE: 2,
  CANDIDATE: 3,
  IMPLEMENTATION_SALE: 4, // Sale triển khai
  RESPONSIBLE_SALE: 5, // Sale phụ trách
  HRO: 6,
  COLLABORATOR: 7, //Cộng tác viên
};

export const IS_ACTIVE = {
  ACTIVE: 1, // Hoạt động
  INACTIVE: 0, // Ngừng hoạt động
};
export const REGISTER_STATUS = {
  PENDING: 0, // Chờ duyệt
  APPROVE: 1, // Đã duyệt
  REJECT: 2, // Từ chối
};
export const TYPE_CALL_HOUR = {
  CALL: 1,
  HOUR: 2,
};
export const USER_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  WAITING: 2,
};

export const CANDIDATE_STATUS = {
  OPEN_CV: 1, // Mở CV
  CLOSE_CV: 2, // Đóng CV
  PENDING: 3, // Chờ duyệt
  REJECT: 4, // Từ chối
};

export const CV_UPLOAD_STATUS = {
  OPEN_CV: 1, // Mở CV
  CLOSE_CV: 2, // Đóng CV
  PENDING: 3, // Chờ duyệt
  REJECT: 4, // Từ chối
};

export const GENDER = {
  MALE: 1, // Nam giới
  FEMALE: 2, // Nữ giới
  NO_UPDATE: 3, // Chưa cập nhật
};

export const RECRUITMENT_STATUS = {
  PENDING: 1, // Đang chờ_Tạo mới
  IN_PROGRESS: 2, // Đã tiếp nhận
  PROCESSED: 3, // Đã xử lý_Đang tuyển dụng
  REJECTED: 4, // Từ chối
  COMPLETED: 5, // Hoàn thành
  UPDATE: 6, //Cập nhật
  ADD_CANDIDATE: 7, //Thêm ứng viên vào YCTD
  UPDATE_CANDIDATE_STATUS: 8, // Thay đổi trạng thái ứng viên trong YCTD
  DELETE_CANDIDATE: 9, // Xóa ứng viên trong YCTD
  OVERDUE: 10, //Quá hạn
  DRAFT: 11, //Nháp
};

export const HIRE_REQUIREMENT_STATUS = {
  PENDING: 1, //Chờ tiếp nhận
  PROCESSED: 2, //Đang xử lý
  IN_PROGRESS: 3, //Đang chạy công việc
  PAUSE: 4, //Tạm dừng
  COMPLETED: 5, //Hoàn Thành
  REJECT: 6, //Từ chối
};

export const CANDIDATE_HIRE_REQUIREMENT_STATUS = {
  PENDING: 1, //Ứng viên doanh nghiệp yêu cầu
  IN_PROGRESS: 2, //Đang trao đổi với ứng viên
  WORKING: 3, //Đang làm việc
  PAUSE: 4, //Tạm dừng
  REJECT: 5, //Từ chối
  COMPLETED: 6, //Hoàn Thành
};

export const FEE_TYPE = {
  CV: 1,
  HUNT: 2,
};
export const TYPE_OF_FEE = {
  ENTERPRISE: 1,
  HRO: 2,
  CANDIDATE: 3,
};

export const CANDIDATE_RECRUITMENT_STATUS = {
  PENDING_CV: 0, //Chờ xác nhận
  PENDING: 1, //Chờ xác nhận
  APPROVE_CV: 2, //Chọn CV Xác nhận
  REJECT_CV: 3, //Loại CV_ Từ chối
  SCHEDULE_INTERVIEW: 4, // Hẹn lịch phỏng vấn
  RE_SCHEDULE_INTERVIEW: 5, // Hẹn lại lịch phỏng vấn
  SUCCESSFUL_INTERVIEW: 6, // Phỏng vấn thành công
  FAIL_INTERVIEW: 7, // Không đến phỏng vấn
  GET_A_JOB: 8, // Đã nhận việc
  DO_NOT_GET_A_JOB: 9, // Không nhận việc
  OFFER_LATER: 10, //Gửi offer later
  APPROVE_OFFER_LATER: 11, //Đồng ý later
  REJECT_OFFER_LATER: 12, //Từ chối later
  HRO_ADD_CV: 13, // Hro thêm ứng viên
  ON_BOARD: 14, // Ứng viên đã đi làm
  WARRANTY_EXPIRED: 15, // Hết hạn bảo hành
};

export const RECRUITMENT_REQUIREMENT_TYPE = {
  JD_FORM: 1,
  JD_FILE: 2,
  RECRUITMENT: 3,
};

export const DEFAULT_PASSWORD = '123456';

export const INTEREST_LIST_STATUS = {
  WAITING_APPROVE: 1, //Chờ duyệt/ Đã được chọn
  IN_CONTACT: 2, //Đang liên hệ/ Đang xử lý
  REJECT: 3, //Từ chối
  APPROVE: 4, //Đã duyệt/ Bắt đầu làm việc
  EXPIRE: 5, //Đã hết hạn
};

export interface NotificationPayload {
  title?: string;
  content?: string;
  type: number;
  data: any;
}
export const NOTIFICATION_TYPE = {
  RENT_CANDIDATE: 1, //Thuê ứng viên
  RECRUITMENT: 2, //Thông báo tuyển dụng
  CHOOSE_CANDIDATE: 3, // Chọn ứng viên
  RE_RECRUITMENT: 4, // Tuyển lại nhân viên hết hạn
  CREATE_RECRUITMENT_REQUIREMENT: 5, // Tạo Yêu cầu tuyển dụng
  ENTERPRISE_REGISTER: 6, // Đăng ký doanh nghiệp
  UPDATE_RECRUITMENT_REQUIREMENT_STATUS: 7, //Cập nhật trạng thái yêu cầu tuyển dụng
  ADD_RESPONSIBLE_SALE: 8, //Add sale phụ trách
  ADD_IMPLEMENT_SALE: 9, // Add sale triển khai
  ADD_CANDIDATE: 10, // Thêm ứng viên vào yêu cầu tuyển dụng
  UPDATE_CANDIDATE_RECRUITMENT_STATUS: 11, // Thay đổi trạng thái của ứng viên trong yêu cầu tuyển dụng
  REMIND_INTERVIEW: 12, //Nhắc lịch hẹn phỏng vấn
  WALLET: 13, //Cập nhật ví
  REGISTER_HRO: 14, // Đăng ký tài khoản HRO
  ADD_HRO: 15, // Thêm HRO vào yêu cầu tuyển dụng
  POINT: 16, // Điểm HRO
  NEW_WALLET_REQUIREMENT: 17, // Yêu cầu rút tiền mới
  NEW_APPLICATION_TO_APPROVE: 18, // Ứng tuyển cần chờ duyệt
  NEW_CANDIDATE_TO_APPROVE: 19, // Ứng viên mới cần chờ duyệt
};
export const TRACKING_TYPE = {
  DETAIL_CANDIDATE: 1,
};

export const APPLIED_FILE_TYPE = {
  FROM_APPLICATION: 1,
  FROM_DEVICE: 2,
};

export const IS_PUSH = {
  NOT_PUSH: 0,
  PUSH: 1,
};

export const IS_READ = {
  NOT_READ: 0,
  READ: 1,
};

export const DATA_TYPE = {
  OPTIONS: 'options',
  TEXT: 'text',
  NUMBER: 'number',
  DATE_TIME: 'date_time',
};

export const WALLET_TYPE = {
  ADD: 1,
  SUB: 2,
};

export const JOB_TYPE = {
  CALL: 1,
  HOUR: 2,
};

export const WALLET_MUTABLE_TYPE = {
  ADD_UPDATE: 1,
  SUB_UPDATE: 2,
  CV: 3,
  HUNT: 4,
};

export const POINT_TYPE = {
  ADD: 1,
  SUB: 2,
};

export const POINT_MUTABLE_TYPE = {
  ADD_UPDATE: 1,
  SUB_UPDATE: 2,
  ADD_CV: 3,
  REMOVE_CV: 4,
};
export const IS_ONLINE = {
  NO: 0,
  YES: 1,
  NO_UPDATE: 2,
};

export const JOB_STATUS = {
  ACTIVE: 1, // Hoạt động
  INACTIVE: 0, // Ngừng hoạt động
  DRAFT: 2, //Nháp
};

export const BANNER_TYPE = {
  BANNER: 1, // Banner
  POLICY: 2, // Chính sách
  // ADVERTISE: 3, // Quảng cáo
  // RECRUITMENT: 4, // Tin tuyển dụng
  // NEWS: 5, // Tin tức
  // ANOTHER: 6, // khác
};

export const BANNER_STATUS = {
  ACTIVE: 1, // Hoạt động - Đăng bài
  INACTIVE: 0, // Ngừng hoạt động - Lưu nháp
};

export const WALLET_REQUIREMENT_STATUS = {
  PENDING: 1, // Pending - Chờ phê duyệt
  RESOLVED: 2, // Resolved - Đã duyệt
  REJECTED: 0, // Rejected - Đã từ chối
};
