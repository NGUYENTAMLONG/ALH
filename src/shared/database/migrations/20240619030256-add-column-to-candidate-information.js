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
          'position_id',
          { type: Sequelize.INTEGER, allowNull: true },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'candidate_information',
          'degree_id',
          { type: Sequelize.INTEGER, allowNull: true },
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
        queryInterface.removeColumn('candidate_information', 'position_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('candidate_information', 'degree_id', {
          transaction: t,
        }),
      ]);
    });
  },
};
