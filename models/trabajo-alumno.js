const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');


const TrabajoAlumno = sequelize.define('TrabajoAlumno', {
    IDTrabajoAlumno: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDTrabajo: {
        type: Sequelize.STRING
    },
    IDAlumno: {
        type: Sequelize.STRING
    },
    Observaciones: {
        type: Sequelize.DATE
    },
    FechaActualizacion: {
        type: Sequelize.STRING
    },
    Estado: {
        type: Sequelize.STRING
    }
}, {
    timestamps:false,
    tableName: 'TrabajoAlumno'
});

module.exports = TrabajoAlumno;