const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Sesion = sequelize.define('Sesion', {
    IDSesion: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: true,
        defaultValue: Sequelize.UUIDV4
    },
    IDGrupo: {
        type: Sequelize.UUIDV4
    },
    IDBimestre: {
        type: Sequelize.UUIDV4
    },
    Fecha: {
        type: Sequelize.DATE,
       // defaultValue: new Date() 
   },
   FechaActualiacion: {
     type: Sequelize.DATE,
     defaultValue: new Date() 
 },
 Observacion: {
    type: Sequelize.STRING
},
FechaSync: {
    type: Sequelize.STRING
}
}, {
    createdAt: false,
    updatedAt: false,
    timestamps:false,
    tableName: 'Sesion'
});

module.exports = Sesion;