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
          'file',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'recruitment_requirement',
          'recruitment_requirement_type_id',
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
        queryInterface.removeColumn('recruitment_requirement', 'file', {
          transaction: t,
        }),
        queryInterface.removeColumn(
          'recruitment_requirement',
          'recruitment_requirement_type_id',
          { transaction: t },
        ),
      ]);
    });
  },
};
