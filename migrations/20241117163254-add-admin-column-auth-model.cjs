'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Auth', 'admin', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Auths', 'admin');
  }
};
