const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Grupo = sequelize.define('Grupos', {
    IDGrupo: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDUsuario: {
        type: Sequelize.STRING
    },
    Materia: {
        type: Sequelize.STRING
    },
    Grado: {
        type: Sequelize.STRING
    },
    Grupo: {
        type: Sequelize.STRING
    },
    Escuela: {
        type: Sequelize.STRING
    },
    RegistroFederalEscolar: {
        type: Sequelize.STRING
    },
    Turno: {
        type: Sequelize.STRING
    },
    Status: {
        type: Sequelize.STRING
    },
    Color: {
        type: Sequelize.STRING
    },
    Ciclo: {
        type: Sequelize.STRING
    },
    createdAt: {
        type : Sequelize.DATE,
        field: 'Timestamp'
    },
    EsTaller: {
        type: Sequelize.BOOLEAN
    },
}, {
    updatedAt: false
});

module.exports = Grupo;