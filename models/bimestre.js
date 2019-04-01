const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Bimestre = sequelize.define('Bimestres', {
    IDBimestre: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDGrupo: {
        type: Sequelize.STRING
    },
    Bimestre: {
    type: Sequelize.STRING
    }
}, {
    timestamps:false,
     tableName: 'Bimestres'
});

module.exports = Bimestre;