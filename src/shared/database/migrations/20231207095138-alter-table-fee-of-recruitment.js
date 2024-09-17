'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.changeColumn(
      'fee_of_recruitment_requirement',
      'price',
      {
        type: DataTypes.DECIMAL(18, 0),
        defaultValue: null,
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.changeColumn(
      'fee_of_recruitment_requirement',
      'price',
      {
        type: DataTypes.DECIMAL(18, 0),
        defaultValue: null,
        allowNull: true,
      },
    );
  },
};
