const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const TrabajoAlumno = require('./trabajo-alumno');

const Trabajo = sequelize.define('Trabajo', {
    IDTrabajo: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    Nombre: {
        type: Sequelize.STRING
    },
    IDGrupo: {
        type: Sequelize.STRING
    },
    Fecha: {
        type: Sequelize.DATE
    },
    IDBimestre: {
        type: Sequelize.STRING
    },
    Observaciones: {
        type: Sequelize.STRING
    },
    Descripcion: {
        type: Sequelize.STRING
    },
    Tipo: {
        type: Sequelize.STRING
    },
    Actividad: {
        type: Sequelize.STRING
    }
}, {
    timestamps:false,
    tableName: 'Trabajo'
});

module.exports = Trabajo;