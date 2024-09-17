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
          'recruitment_requirement_history',
          'candidate_information_id',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'recruitment_requirement_history',
          'candidate_recruitment_status',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'recruitment_requirement_history',
          'note',
          {
            type: Sequelize.TEXT,
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
          'recruitment_requirement_history',
          'candidate_information_id',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'recruitment_requirement_history',
          'candidate_recruitment_status',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn('recruitment_requirement_history', 'note', {
          transaction: t,
        }),
      ]);
    });
  },
};
