export const CreateRecruitmentSchema = {
  status: 1,
  code: 200,
  msg: 'Thành công',
  data: [
    {
      id: 1,
      professional_field_id: 1,
      enterprise_id: 7,
      df_province_id: 101,
      salary_range_id: 1,
      years_of_experience_id: 1,
      age_group_id: 1,
      created_by: 29,
      gender_id: 1,
      job_description: '0',
      code: 'YC0001',
      recruitment_count: 5,
      benefits_and_treatment: '0',
      enterprise_introduction: '0',
      status: 2,
      created_at: '2023-08-29T04:08:56.000Z',
      updated_at: '2023-08-29T04:08:56.000Z',
      deleted_at: null,
      professional_field: {
        id: 1,
        name: 'Bất động sản',
        description: 'Lĩnh vực đang cần nhân lực vào thời điểm hiện tại',
        created_at: '2023-08-16T09:50:34.000Z',
        updated_at: '2023-08-16T10:22:48.000Z',
        deleted_at: null,
      },
      recruitment_job_type:
        'Part time, Fulltime Onsite, Fulltime Online, Part time, Fulltime Onsite, Fulltime Online.',
      df_province: {
        id: 101,
        name: 'Hà Nội',
        value: null,
        prefix: null,
        is_active: 1,
        create_by: null,
        update_by: null,
        delete_by: null,
        version: 0,
        created_at: '2021-08-30T08:52:54.000Z',
        updated_at: '2021-08-30T08:52:54.000Z',
        deleted_at: null,
      },
    },
  ],
  paging: {
    total_count: 1,
    current_page: 1,
    limit: '12',
    offset: 0,
  },
  links: {},
  blocks: {
    status: [
      {
        id: 4,
        name: 'Đang xử lý',
      },
      {
        id: 1,
        name: 'Đã xử lý',
      },
      {
        id: 2,
        name: 'Đang chờ',
      },
      {
        id: 3,
        name: 'Từ trối',
      },
    ],
  },
};
