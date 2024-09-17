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
    return queryInterface.bulkInsert('year_of_experience', [
      {
        min_years: 0,
        max_years: 0,
        description: 'Chưa có kinh nghiệm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_years: 0,
        max_years: 1,
        description: '1 năm kinh nghiệm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_years: 1,
        max_years: 2,
        description: '2 năm kinh nghiệm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_years: 2,
        max_years: 3,
        description: '3 năm kinh nghiệm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_years: 3,
        max_years: 4,
        description: '4 năm kinh nghiệm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_years: 4,
        max_years: 5,
        description: '5 năm kinh nghiệm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_years: 5,
        max_years: 10,
        description: '10 năm kinh nghiệm',
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
    return queryInterface.bulkDelete('year_of_experience', null, {});
  },
};
