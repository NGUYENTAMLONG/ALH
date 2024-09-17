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
    return queryInterface.createTable('application', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      avatar: { type: Sequelize.STRING, allowNull: true },
      full_name: { type: Sequelize.STRING, allowNull: true },
      phone_number: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.STRING, allowNull: true },
      education: { type: Sequelize.TEXT, allowNull: true },
      skill_input: { type: Sequelize.TEXT, allowNull: true },
      career_goals: { type: Sequelize.TEXT, allowNull: true },
      position_input: { type: Sequelize.TEXT, allowNull: true },
      gender_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      date_of_birth: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      candidate_information_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      degree_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      year_of_experience_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      position_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      is_all_province: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      salary_range_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('application', {});
  },
};
