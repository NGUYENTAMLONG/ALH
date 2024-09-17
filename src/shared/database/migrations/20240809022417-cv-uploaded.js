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
    return queryInterface.createTable('cv_uploaded', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      created_by: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: true },
      candidate_information_id: { type: Sequelize.INTEGER, allowNull: true },
      candidate_info_review_id: { type: Sequelize.INTEGER, allowNull: true },
      file: { type: Sequelize.STRING, allowNull: false },
      file_name: { type: Sequelize.STRING, allowNull: false },
      is_main: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
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
    return queryInterface.dropTable('cv_uploaded', {});
  },
};
