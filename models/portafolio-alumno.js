const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const PortafolioAlumno = sequelize.define('PortafolioAlumno', {
    IDPortafolioAlumno: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDPortafolio: {
        type: Sequelize.STRING
    },
    IDAlumno: {
        type: Sequelize.STRING
    },
    Estado: {
        type: Sequelize.STRING
    },
    Aspecto1: {
        type: Sequelize.STRING
    },
    Aspecto2: {
        type: Sequelize.STRING
    },
    Aspecto3: {
        type: Sequelize.STRING
    },
    Aspecto4: {
        type: Sequelize.STRING
    },
    Aspecto5: {
        type: Sequelize.STRING
    },
}, {
    updatedAt: false,
    tableName: 'PortafolioAlumno'
});

module.exports = PortafolioAlumno;