const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const TipoPortafolio = sequelize.define('TipoPortafolio', {
    IDTipoPortafolio: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    Nombre: {
        type: Sequelize.STRING
    },
    Aspecto1: {
        type: Sequelize.STRING
    },
    Criterio1: {
        type: Sequelize.STRING
    },
    Aspecto2: {
        type: Sequelize.STRING
    },
    Criterio2: {
        type: Sequelize.STRING
    },
    Aspecto3: {
        type: Sequelize.STRING
    },
    Criterio3: {
        type: Sequelize.STRING
    },
    Aspecto4: {
        type: Sequelize.STRING
    },
    Criterio4: {
        type: Sequelize.STRING
    },
    Aspecto5: {
        type: Sequelize.STRING
    },
    Criterio5: {
        type : Sequelize.STRING,
    },
    Activo1: {
        type : Sequelize.STRING,
    },
    Activo2: {
        type : Sequelize.STRING,
    },
    Activo3: {
        type : Sequelize.STRING,
    },
    Activo4: {
        type : Sequelize.STRING,
    },
    Activo5: {
        type : Sequelize.STRING,
    },
}, {
    updatedAt: false,
    tableName: 'TipoPortafolio'
});

module.exports = Grupo;