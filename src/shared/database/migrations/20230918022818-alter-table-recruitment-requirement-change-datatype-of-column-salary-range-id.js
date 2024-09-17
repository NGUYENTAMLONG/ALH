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
      'recruitment_requirement',
      'salary_range_id',
      {
        type: DataTypes.INTEGER,
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
      'recruitment_requirement',
      'salary_range_id',
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    );
  },
};
