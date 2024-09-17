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
    return queryInterface.createTable('recruitment_requirement', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      professional_field_id: { type: Sequelize.INTEGER, allowNull: false },

      enterprise_id: { type: Sequelize.INTEGER, allowNull: false },

      df_province_id: { type: Sequelize.INTEGER, allowNull: false },

      salary_range_id: { type: Sequelize.INTEGER, allowNull: false },

      years_of_experience_id: { type: Sequelize.INTEGER, allowNull: false },

      age_group_id: { type: Sequelize.INTEGER, allowNull: false },

      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'user id có role là doanh nghiệp',
      },

      gender_id: { type: Sequelize.INTEGER, allowNull: false },

      job_description: { type: Sequelize.TEXT, allowNull: false },

      code: { type: Sequelize.STRING },

      benefits_and_treatment: { type: Sequelize.TEXT, allowNull: false },

      enterprise_introduction: { type: Sequelize.TEXT, allowNull: false },

      status: { type: Sequelize.INTEGER, allowNull: false },

      recruitment_count: { type: Sequelize.INTEGER, defaultValue: 0 },

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
    return queryInterface.dropTable('recruitment_requirement');
  },
};
