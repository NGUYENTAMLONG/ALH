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
    return queryInterface.createTable('df_province', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      name: { type: Sequelize.STRING, allowNull: false },

      value: { type: Sequelize.STRING },

      prefix: { type: Sequelize.STRING },

      is_active: { type: Sequelize.INTEGER },

      create_by: { type: Sequelize.INTEGER },

      update_by: { type: Sequelize.INTEGER },

      delete_by: { type: Sequelize.INTEGER },

      version: { type: Sequelize.INTEGER },

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

    return queryInterface.dropTable('df_province');
  },
};
