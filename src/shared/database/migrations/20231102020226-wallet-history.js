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
    return queryInterface.createTable('wallet_history', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      wallet_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      type: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      value: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 0),
      },

      current_balance: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 0),
      },

      mutable_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      created_at: {
        type: Sequelize.DATE,
      },

      updated_at: {
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
    return queryInterface.dropTable('wallet_history');
  },
};
