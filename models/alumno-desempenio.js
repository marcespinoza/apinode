const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const AlumnoDesempenio = sequelize.define('AlumnoDesempenio', {
    IDAlumno: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDUsuario: {
        type: Sequelize.STRING
    },
    Bimestre: {
        type: Sequelize.STRING
    },
    IDGrupo: {
        type: Sequelize.STRING
    },
    ColorAsistencia: {
        type: Sequelize.STRING
    },
    ColorTrabajo: {
        type: Sequelize.STRING
    },
    ColorPortafolio: {
        type: Sequelize.STRING
    },
    ColorExamen: {
        type: Sequelize.STRING
    },
    ColorDiagnostico: {
        type: Sequelize.STRING
    }       
}, {
    timestamps:false,
    tableName: 'AlumnoDesempenio'
});

module.exports = AlumnoDesempenio;