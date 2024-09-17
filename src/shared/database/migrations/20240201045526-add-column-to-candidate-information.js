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
          'candidate_information',
          'type_on_call',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'candidate_information',
          'type_on_hour',
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'candidate_information',
          'budget_min',
          {
            type: Sequelize.DECIMAL(18, 0),
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'candidate_information',
          'budget_max',
          {
            type: Sequelize.DECIMAL(18, 0),
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
        queryInterface.removeColumn('candidate_information', 'type_on_call', {
          transaction: t,
        }),
        queryInterface.removeColumn('candidate_information', 'type_on_hour', {
          transaction: t,
        }),
        queryInterface.removeColumn('candidate_information', 'budget_min', {
          transaction: t,
        }),
        queryInterface.removeColumn('candidate_information', 'budget_max', {
          transaction: t,
        }),
      ]);
    });
  },
};
