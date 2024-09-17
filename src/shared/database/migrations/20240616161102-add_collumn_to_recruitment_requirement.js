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
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'recruitment_requirement',
          'apply_deadline',
          {
            allowNull: true,
            type: Sequelize.DATE,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'recruitment_requirement',
          'created_on_mini_app',
          {
            allowNull: false,
            type: Sequelize.BOOLEAN,
          },
          { transaction: t },
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'recruitment_requirement',
          'apply_deadline',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'recruitment_requirement',
          'created_on_mini_app',
          {
            transaction: t,
          },
        ),
      ]);
    });
  },
};
