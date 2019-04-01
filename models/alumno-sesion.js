const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const AlumnoSesion = sequelize.define('AlumnoSesion', {
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
    IDSesion: {
        type: Sequelize.STRING
    },
    FechaActualizacion: {
        type: Sequelize.DATE,
        defaultValue: new Date() 
    },
    Estado: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps:false,
    tableName: 'AlumnoSesion'
});

module.exports = AlumnoSesion;