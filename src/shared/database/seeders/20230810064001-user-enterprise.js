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
    return queryInterface.bulkInsert('user', [
      {
        gender_id: 1,

        role_id: 2,

        full_Name: 'Enterprise',

        email: 'enterprise@gmail.com',

        phone_number: '0987654322',

        password:
          '$2b$10$Yg68yMMVDUripu7cepkGR.TtUDz4MuMT40dgK1IcKg9t9xZVIRQpe',

        avatar: null,

        date_of_birth: new Date(),

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
    return queryInterface.bulkDelete('user', null, {});
  },
};
