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
    return queryInterface.createTable('enterprise', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      position_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'PK bảng position',
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'PK bảng user',
      },

      name: { type: Sequelize.STRING },

      logo: { type: Sequelize.STRING },

      description: { type: Sequelize.STRING },

      status: { type: Sequelize.INTEGER },

      tax_code: { type: Sequelize.STRING },

      website: { type: Sequelize.STRING },

      linkedin: { type: Sequelize.STRING },

      facebook: { type: Sequelize.STRING },

      salesperson: { type: Sequelize.STRING },

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

    return queryInterface.dropTable('enterprise');
  },
};
