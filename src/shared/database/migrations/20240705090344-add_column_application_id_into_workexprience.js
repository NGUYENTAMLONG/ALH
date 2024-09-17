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
        queryInterface.addColumn('work_experience', 'application_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
        }),
        queryInterface.changeColumn(
          'work_experience',
          'candidate_information_id',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
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
        queryInterface.removeColumn('work_experience', 'application_id'),
        queryInterface.changeColumn(
          'work_experience',
          'candidate_information_id',
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        ),
      ]);
    });
  },
};
