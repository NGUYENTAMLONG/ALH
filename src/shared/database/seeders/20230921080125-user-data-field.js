'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert('user_data_field', [
      {
        name: 'Họ và tên',
        code: 'name',
        data_type: 'ref',
        order: 1,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Số điện thoại',
        code: 'phone_number',
        data_type: 'ref',
        order: 2,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mật khẩu',
        code: 'password',
        data_type: 'ref',
        order: 3,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ngày sinh',
        code: 'dob',
        data_type: 'ref',
        order: 4,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'email ',
        code: 'email',
        data_type: 'ref',
        order: 5,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Vị trí công việc ',
        code: 'professional_field',
        data_type: 'ref',
        order: 6,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ghi chú',
        code: 'note',
        data_type: 'ref',
        order: 7,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mức lương mong muốn',
        code: 'salary_range',
        data_type: 'ref',
        order: 8,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Giá thuê ',
        code: 'hire_price',
        data_type: 'ref',
        order: 9,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Địa điểm làm việc',
        code: 'province',
        data_type: 'ref',
        order: 10,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Số năm kinh nghiệm',
        code: 'year_of_experience',
        data_type: 'ref',
        order: 11,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Hình thức làm việc',
        code: 'job_type',
        data_type: 'ref',
        order: 12,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Giới tính',
        code: 'gender',
        data_type: 'ref',
        order: 13,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('user_data_field', null, {});
  },
};
