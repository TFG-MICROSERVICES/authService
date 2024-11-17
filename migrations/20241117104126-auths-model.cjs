'use strict';
//Ejemplo de archivo de migración
//Crear una migración con 'sequelize migration:generate --name 'nombre_modelo'-model'
//Se ejecuta con 'sequelize db:migrate'
//Se deshace con 'sequelize db:migrate:undo'(es opcional ya que es como un rollback)

//Elimina todas las tablas'sequelize db:migrate:undo:all'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Auths', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Auths');
  }
};
