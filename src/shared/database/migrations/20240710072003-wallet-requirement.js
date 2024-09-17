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
    return queryInterface.createTable('wallet_requirement', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wallet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      money: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      to_user: { type: Sequelize.STRING, allowNull: false },
      bank_account: { type: Sequelize.STRING, allowNull: false },
      bank_id: { type: Sequelize.INTEGER, allowNull: false },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1,
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
    return queryInterface.dropTable('wallet_requirement', {});
  },
};
