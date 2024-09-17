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
    return queryInterface.createTable('interest_list', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      candidate_information_id: { type: Sequelize.INTEGER, allowNull: false },
      enterprise_id: { type: Sequelize.INTEGER, allowNull: false },
      professional_field_id: { type: Sequelize.INTEGER, allowNull: false },
      df_province_id: { type: Sequelize.INTEGER, allowNull: false },
      hire_price_id: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: false },
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
    return queryInterface.dropTable('interest_list', {});
  },
};
