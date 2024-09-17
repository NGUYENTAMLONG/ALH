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
    return queryInterface.createTable('recruitment_request_file', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      enterprise_id: { type: Sequelize.INTEGER, allowNull: false },

      code: { type: Sequelize.STRING, allowNull: false },

      file: { type: Sequelize.STRING, allowNull: false },

      status: { type: Sequelize.INTEGER, allowNull: false },

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

    return queryInterface.dropTable('recruitment_request_file');
  },
};
