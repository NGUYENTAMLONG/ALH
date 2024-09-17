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
    return queryInterface.createTable('skill_experience', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      candidate_information_id: { type: Sequelize.INTEGER, allowNull: true },
      application_id: { type: Sequelize.INTEGER, allowNull: true },
      skill_name: { type: Sequelize.STRING, allowNull: true },
      rating: { type: Sequelize.FLOAT, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
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
    return queryInterface.dropTable('skill_experience');
  },
};
