const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const ExamenTema = sequelize.define('ExamenTema', {
    IDTema: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDExamen: {
        type: Sequelize.STRING
    },
    Nombre: {
        type: Sequelize.STRING
    },
    TipoTema: {
        type: Sequelize.STRING,
        defaultValue: "Sin personalizar"
    },
    Instrucciones: {
        type: Sequelize.STRING,
        defaultValue: "Pregunta"
    },
    Reactivos: {
        type: Sequelize.INTEGER,
        defaultValue: 2
    },
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'ExamenTema'
});

module.exports = ExamenTema;