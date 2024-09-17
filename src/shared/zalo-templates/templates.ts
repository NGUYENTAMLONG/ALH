import * as moment from 'moment';

//Thông báo CV tự ứng tuyển
export const candidateAlreadyApplyTemplate = (
  hr_name: string,
  recruitment_requirement: string,
  link: string,
) => {
  return `Ứng viên ứng tuyển
          Xin chào ${hr_name},
          Alehub vui mừng thông báo rằng có một ứng viên mới đã ứng tuyển vào vị trí ${recruitment_requirement} mà bạn đã đăng tuyển.
          Vui lòng truy cập vào  Alehub ${link} xem chi tiết thông tin ứng viên
          Trân trọng, Hệ thống Tuyển dụng Alehub
          `;
};

//Thông báo về CV Alehub gửi tặng
export const adminGivesCVTemplate = (
  hr_name: string,
  recruitment_requirement: string,
  link: string,
) => {
  return `
      Ứng viên Alehub gửi tặng bạn
      Xin chào ${hr_name},
      Alehub vui mừng thông báo rằng có một ứng viên mới đã được Alehub gửi tặng bạn với vị trí ${recruitment_requirement} mà bạn đã đăng tuyển.
      Vui lòng truy cập vào  Alehub ${link} xem chi tiết thông tin ứng viên
      Trân trọng, Hệ thống Tuyển dụng Alehub
      `;
};

//Admin duyệt công việc đăng tuyển thành công //Thông báo về công việc đăng tuyển được duyệt và điểm thưởng
export const adminApprovesRecruitmentTemplate = (
  hr_name: string,
  recruitment_requirement: string,
  link: string,
  point: string | number,
  link_point: string,
) => {
  return `
      Công việc đăng tuyển đã được duyệt và điểm thưởng
      Xin chào ${hr_name},
      Alehub vui mừng thông báo rằng công việc ${recruitment_requirement} mà bạn đăng tuyển đã được duyệt thành công.
      Vui lòng kiểm tra và cập nhật nếu cần thiết ${link}. 
      **Thông tin điểm thưởng:** 
      - Điểm thưởng được cộng: ${point} 
      Bạn có thể sử dụng điểm thưởng này để đổi các dịch vụ tuyển dụng khác trên hệ thống của chúng tôi ${link_point}
      Trân trọng, Hệ thống Tuyển dụng Alehub
      `;
};

//Thông báo công việc sắp hết hạn đăng tuyển (trước 3 ngày và 1 ngày)
export const recruitmentExpireTemplate = (
  hr_name: string,
  recruitment_requirement: string,
  recruitment_created_at: string | Date,
  apply_deadline: string | Date,
  link: string,
) => {
  const currentDate = moment().format('YYYY-MM-DD');
  const targetDate = moment(apply_deadline, 'YYYY-MM-DD');
  const remaining_days = targetDate.diff(currentDate, 'days');
  return `
        Công việc đăng tuyển sắp hết hạn (${remaining_days} ngày nữa)
        Xin chào ${hr_name},
        Alehub xin thông báo rằng công việc ${recruitment_requirement} mà bạn đã đăng tuyển sẽ hết hạn trong ${remaining_days} ngày tới (ngày ${moment(
    apply_deadline,
  ).format('DD-MM-YYYY')}).
        **Chi tiết công việc:**
        - Tên vị trí: ${recruitment_requirement}
        - Ngày đăng tuyển: ${moment(recruitment_created_at).format(
          'DD-MM-YYYY',
        )}
        - Ngày hết hạn: ${moment(apply_deadline).format('DD-MM-YYYY')} 
        Nếu bạn muốn gia hạn thêm thời gian đăng tuyển cho vị trí này, vui lòng truy cập vào hệ thống và thực hiện gia hạn ${link}
        Trân trọng, Hệ thống Tuyển dụng Alehub
      `;
};

//Thông báo gợi ý công việc phù hợp với ứng viên
export const recruitmentInterestTemplate = (
  candidate_name: string,
  job_count: string | number,
  recruitments: {
    name: string;
    enterprise: string;
    salary_range: string;
    link: string;
  }[],
) => {
  const str = recruitments
    .map((elm) => {
      return `
              - Tên vị trí: ${elm.name}
              - Công ty:  ${elm.enterprise} 
              - Mức lương: ${elm.salary_range} 
               ${elm.link}
    `;
    })
    .join('');

  return `
        Gợi ý ${job_count} công việc phù hợp với bạn
        Chào ${candidate_name}, 
        Alehub mong muốn giúp bạn tìm được công việc mơ ước của mình. Dựa trên thông tin của bạn, chúng tôi đã tìm được những công việc mới nhất phù hợp bạn. Để xem chi tiết về công việc và ứng tuyển, vui lòng chọn công việc bạn quan tâm
        **Thông tin công việc:** 
            ${str}
        .
        .
        Trân trọng, Hệ thống Tuyển dụng Alehub
      `;
};
