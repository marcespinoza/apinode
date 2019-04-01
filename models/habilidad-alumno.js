const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Habilidad = sequelize.define('HabilidadesAlumno', {
    IDHabilidadAlumno: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDAlumno: {
        type: Sequelize.STRING
    },
    IDGrupo: {
    type: Sequelize.STRING
    },
    IDBimestre: {
    type: Sequelize.STRING
    },
    Autoevaluacion: {
    type: Sequelize.INTEGER
    },
    Coevaluacion: {
    type: Sequelize.STRING
    },
    Comprension: {
    type: Sequelize.STRING
    },
    Conocimiento: {
    type: Sequelize.STRING
    },
    Sintesis: {
    type: Sequelize.STRING
    },
    Argumentacion: {
    type: Sequelize.STRING
    },
    ApoyoLectura: {
    type: Sequelize.STRING
    },
    ApoyoEscritura: {
    type: Sequelize.STRING
    },
    ApoyoMatematicas: {
    type: Sequelize.STRING
    },
    SeInvolucraClase: {
    type: Sequelize.BOOLEAN
    }
}, {
    timestamps:false,
    tableName: 'HabilidadesAlumno'
});

module.exports = Habilidad;