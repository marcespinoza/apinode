const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const ExamenAlumno = sequelize.define('ExamenAlumno', {
    IDTema: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    IDAlumno: {
        type: Sequelize.STRING
    },
    Calificacion: {
        type: Sequelize.DOUBLE
    },
    FechaActualizacion: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
    }
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'ExamenAlumno'
});

module.exports = ExamenAlumno;