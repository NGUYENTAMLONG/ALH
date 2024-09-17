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
    return queryInterface.bulkInsert('recruitment_requirement_type', [
      {
        name: 'JD theo mẫu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'JD có sẵn',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tuyển dụng',
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
    return queryInterface.bulkDelete('recruitment_requirement_type', null, {});
  },
};
