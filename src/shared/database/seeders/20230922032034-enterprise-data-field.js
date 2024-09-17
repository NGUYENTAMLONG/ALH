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
    return queryInterface.bulkInsert('enterprise_data_field', [
      {
        name: 'Tên công ty',
        code: 'name',
        data_type: 'ref',
        order: 1,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Số điện thoại liên hệ',
        code: 'phone_number',
        data_type: 'ref',
        order: 2,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Người liên hệ',
        code: 'full_name',
        data_type: 'ref',
        order: 3,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Chức vụ',
        code: 'position',
        data_type: 'ref',
        order: 4,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mật khẩu',
        code: 'password',
        data_type: 'ref',
        order: 5,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'email ',
        code: 'email',
        data_type: 'ref',
        order: 6,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Lĩnh vực hoạt động ',
        code: 'professional_field',
        data_type: 'ref',
        order: 7,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Mã số thuế',
        code: 'tax_code',
        data_type: 'ref',
        order: 8,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tỉnh thành phố',
        code: 'province',
        data_type: 'ref',
        order: 9,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Quận/Huyện',
        code: 'district',
        data_type: 'ref',
        order: 10,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Xã/Phường',
        code: 'ward',
        data_type: 'ref',
        order: 11,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Địa chỉ chi tiết',
        code: 'address',
        data_type: 'ref',
        order: 12,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Sale phụ trách',
        code: 'salesperson',
        data_type: 'ref',
        order: 13,
        is_required: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Facebook',
        code: 'facebook',
        data_type: 'ref',
        order: 14,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Linkedin',
        code: 'linkedin',
        data_type: 'ref',
        order: 15,
        is_required: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Website',
        code: 'website',
        data_type: 'ref',
        order: 16,
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
    return queryInterface.bulkDelete('enterprise_data_field', null, {});
  },
};
