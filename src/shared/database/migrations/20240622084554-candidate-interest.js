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
    return queryInterface.createTable('candidate_interest', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      candidate_information_id: { type: Sequelize.INTEGER, allowNull: false },
      df_degree_id: { type: Sequelize.INTEGER, allowNull: true },
      year_of_experience_id: { type: Sequelize.INTEGER, allowNull: true },
      position_id: { type: Sequelize.INTEGER, allowNull: true },
      salary_range_id: { type: Sequelize.INTEGER, allowNull: true },
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
    return queryInterface.dropTable('candidate_interest', {});
  },
};
