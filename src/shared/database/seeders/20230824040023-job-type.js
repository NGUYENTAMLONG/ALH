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
    return queryInterface.bulkInsert('job_type', [
      {
        job_type_time_id: 1,
        job_type_workplace_id: 1,
        name: 'Fulltime Online',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        job_type_time_id: 1,
        job_type_workplace_id: 2,
        name: 'Fulltime Onsite',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        job_type_time_id: 2,
        job_type_workplace_id: null,
        name: 'Part time',
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
    return queryInterface.bulkDelete('job_type', null, {});
  },
};
