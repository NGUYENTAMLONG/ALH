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
    return queryInterface.createTable('candidate_recruitment', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      recruitment_requirement_id: { type: Sequelize.INTEGER, allowNull: false },
      candidate_information_id: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: false },
      note: { type: Sequelize.TEXT },
      schedule: { type: Sequelize.DATE },
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
    return queryInterface.dropTable('candidate_recruitment', {});
  },
};
