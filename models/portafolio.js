const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Portafolio = sequelize.define('Portafolio', {
    IDPortafolio: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDGrupo: {
        type: Sequelize.STRING
    },
    IDBimestre: {
        type: Sequelize.STRING
    },
    Nombre: {
        type: Sequelize.STRING
    },
    FechaEntrega: {
        type: Sequelize.DATE
    },
    TipoTrabajo: {
        type: Sequelize.STRING
    },
    Descripcion: {
        type: Sequelize.STRING
    },
    IDTipoPortafolio: {
        type: Sequelize.STRING
    },
}, {
    updatedAt: false,
    tableName: 'Portafolio'
});

module.exports = Portafolio;