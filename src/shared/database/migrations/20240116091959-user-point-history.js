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
    return queryInterface.createTable('user_point_history', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      user_point_id: {
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

      current_point: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 0),
      },

      mutable_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recruitment_requirement_id: {
        type: Sequelize.INTEGER,
      },
      candidate_information_id: {
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.TEXT,
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
    return queryInterface.dropTable('user_point_history');
  },
};
