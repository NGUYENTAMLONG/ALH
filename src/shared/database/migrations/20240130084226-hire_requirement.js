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
    return queryInterface.createTable('hire_requirement', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      enterprise_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      years_of_experience_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },

      age_group_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },

      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      implementation_sale_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING,
      },

      code: {
        type: Sequelize.STRING,
      },

      recruitment_count: {
        type: Sequelize.INTEGER,
      },

      is_all_province: {
        type: Sequelize.INTEGER,
      },

      note: {
        type: Sequelize.TEXT,
      },

      type_on_call: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      type_on_hour: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      count: {
        type: Sequelize.INTEGER,
      },

      price: {
        type: Sequelize.DECIMAL(18, 0),
      },

      total_price: {
        type: Sequelize.DECIMAL(18, 0),
      },

      budget_min: {
        type: Sequelize.DECIMAL(18, 0),
      },

      budget_max: {
        type: Sequelize.DECIMAL(18, 0),
      },

      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    return queryInterface.dropTable('hire_requirement');
  },
};
