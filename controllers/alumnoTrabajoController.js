const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const Trabajo = require('../models/trabajo');
const Alumno = require('../models/alumno');
const AlumnoDesempenio = require('../models/alumno-desempenio');
const AlumnoSesion = require('../models/alumno-sesion');
const env = require('simpledot');

module.exports["getTrabajosAlumno"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            Trabajo.findAll({where: {IDGrupo: req.query.grupo}, attributes: ['IDTrabajo', 'IDGrupo', 'Nombre', 'Fecha', 'IDBimestre', 'Observaciones', 'Descripcion', 'Tipo', 'Actividad']}).then(trabajos => {
                if (alumno.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene grupos."
                    })
                } else {
                    const data = {
                        trabajos: trabajos
                    }
                    res.json({
                        status: 1,
                        data: data
                    })
                }
            });
        }
    });
}