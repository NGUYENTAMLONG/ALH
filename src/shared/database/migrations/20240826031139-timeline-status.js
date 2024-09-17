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
    return queryInterface.createTable('timeline_status', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      candidate_recruitment_id: { type: Sequelize.INTEGER, allowNull: false },
      candidate_information_id: { type: Sequelize.INTEGER, allowNull: true },
      candidate_info_review_id: { type: Sequelize.INTEGER, allowNull: true },
      status: { type: Sequelize.INTEGER, allowNull: false },
      modify_date: { type: Sequelize.DATE, allowNull: true },
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
    return queryInterface.dropTable('timeline_status', {});
  },
};
