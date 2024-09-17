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
    return queryInterface.createTable('fee_of_recruitment_requirement', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      fee_type_id: { type: Sequelize.INTEGER, allowNull: false },
      recruitment_requirement_id: { type: Sequelize.INTEGER, allowNull: false },
      professional_field_id: { type: Sequelize.INTEGER, allowNull: true },
      price: { type: Sequelize.INTEGER },
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
    return queryInterface.dropTable('fee_of_recruitment_requirement', {});
  },
};
