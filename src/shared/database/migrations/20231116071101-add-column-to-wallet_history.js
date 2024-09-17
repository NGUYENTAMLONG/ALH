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
          'wallet_history',
          'recruitment_requirement_id',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'wallet_history',
          'candidate_information_id',
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
      return promise.all([
        queryInterface.removeColumn(
          'wallet_history',
          'recruitment_requirement_id',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'wallet_history',
          'candidate_information_id',
          {
            transaction: t,
          },
        ),
      ]);
    });
  },
};
