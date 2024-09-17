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
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'recruitment_requirement',
          'years_of_experience_id',
          {
            type: Sequelize.TEXT,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'created_by',
          {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'gender_id',
          {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'job_description',
          {
            type: Sequelize.TEXT,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'benefits_and_treatment',
          {
            type: Sequelize.TEXT,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'enterprise_introduction',
          {
            type: Sequelize.TEXT,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'df_province_id',
          {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'recruitment_requirement',
          'professional_field_id',
          {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
