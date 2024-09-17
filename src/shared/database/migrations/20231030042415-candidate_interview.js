'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('candidate_interview', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      df_province_id: { type: Sequelize.INTEGER, allowNull: false },
      candidate_recruitment_id: { type: Sequelize.INTEGER, allowNull: false },
      candidate_information_id: { type: Sequelize.INTEGER, allowNull: false },
      phone_number: { type: Sequelize.TEXT, allowNull: false },
      interviewer: { type: Sequelize.TEXT, allowNull: false },
      is_online: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      schedule: { type: Sequelize.DATE, allowNull: false },
      address: { type: Sequelize.TEXT, allowNull: false },
      note: { type: Sequelize.TEXT },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('candidate_interview', {});
  },
};
