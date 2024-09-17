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
          'enterprise',
          'professional_field_text',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'enterprise',
          'employee_count',
          {
            type: Sequelize.INTEGER,
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
        queryInterface.removeColumn('enterprise', 'professional_field', {
          transaction: t,
        }),
        queryInterface.removeColumn('enterprise', 'employee_count', {
          transaction: t,
        }),
      ]);
    });
  },
};
