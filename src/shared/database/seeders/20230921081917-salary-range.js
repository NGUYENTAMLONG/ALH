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
    return queryInterface.bulkInsert('salary_range', [
      {
        min_salary: 1000000,
        max_salary: 3000000,
        description: 'triệu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_salary: 3000000,
        max_salary: 5000000,
        description: 'triệu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_salary: 5000000,
        max_salary: 7000000,
        description: 'triệu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_salary: 7000000,
        max_salary: 10000000,
        description: 'triệu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_salary: 10000000,
        max_salary: 15000000,
        description: 'triệu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_salary: 15000000,
        max_salary: 20000000,
        description: 'triệu',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        min_salary: 20000000,
        max_salary: 30000000,
        description: 'triệu',
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
    return queryInterface.bulkDelete('salary_range', null, {});
  },
};
