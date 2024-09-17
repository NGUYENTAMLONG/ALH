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
          'interest_list',
          'start_time',
          {
            type: Sequelize.DATE,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'interest_list',
          'end_time',
          {
            type: Sequelize.DATE,
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
      return promise.all([
        queryInterface.removeColumn('interest_list', 'start_time', {
          transaction: t,
        }),
        queryInterface.removeColumn('interest_list', 'end_time', {
          transaction: t,
        }),
      ]);
    });
  },
};
