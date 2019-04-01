const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Alumno = sequelize.define('Alumno', {
    IDAlumno: {
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
    ApellidoPaterno: {
        type: Sequelize.STRING
    },
    ApellidoMaterno: {
        type: Sequelize.STRING
    },
    Curp: {
        type: Sequelize.STRING
    },
    Estado: {
        type: Sequelize.STRING
    },
    EsUSAER: {
        type: Sequelize.STRING
    },
    NombreCompleto: {
        type: Sequelize.STRING
    },
    PromedioBimestre1: {
        type: Sequelize.STRING
    },
    PromedioBimestre2: {
        type: Sequelize.STRING
    },
    PromedioBimestre3: {
        type: Sequelize.STRING
    },
    PromedioBimestre4: {
        type: Sequelize.STRING
    },
    PromedioBimestre5: {
        type: Sequelize.STRING
    },
    PromedioTotal: {
        type: Sequelize.STRING
    },
    ColorPromedio: {
        type: Sequelize.STRING
    },
    Grupo: {
        type: Sequelize.STRING,
    }
}, {
    timestamps:false,
    tableName: 'Alumno'
});

module.exports = Alumno;