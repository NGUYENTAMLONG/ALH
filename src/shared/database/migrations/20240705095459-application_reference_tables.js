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
        queryInterface.createTable('application_career', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          application_id: { type: Sequelize.INTEGER, allowNull: false },
          df_career_id: { type: Sequelize.INTEGER, allowNull: false },
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
        }),
        queryInterface.createTable('application_job_type', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          application_id: { type: Sequelize.INTEGER, allowNull: false },
          job_type_id: { type: Sequelize.INTEGER, allowNull: false },
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
        }),
        queryInterface.createTable('application_province', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          application_id: { type: Sequelize.INTEGER, allowNull: false },
          df_province_id: { type: Sequelize.INTEGER, allowNull: false },
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
        }),
        queryInterface.createTable('application_cv', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          application_id: { type: Sequelize.INTEGER, allowNull: false },
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
        }),
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
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('application_career', {}),
        queryInterface.dropTable('application_job_type', {}),
        queryInterface.dropTable('application_province', {}),
        queryInterface.dropTable('application_cv', {}),
      ]);
    });
  },
};
