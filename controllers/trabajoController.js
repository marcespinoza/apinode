const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const Trabajo = require('../models/trabajo');
const TrabajoAlumno = require('../models/trabajo-alumno');
const Alumno = require('../models/alumno');
const AlumnoDesempenio = require('../models/alumno-desempenio');
const AlumnoSesion = require('../models/alumno-sesion');
const env = require('simpledot');
const instanceSequelize = require('../config/sequelize');
const moment = require('moment');

module.exports["getTrabajos"] = function(req, res) {
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
                if (trabajos.length == 0) {
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

module.exports["postTrabajo"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            const alumno = "'" + req.body.alumno + "'";
            const bimestre = "'" + req.body.bimestre + "'";
            Alumno.findAll({where: {IDGrupo: req.body.grupo}, attributes: ['IDAlumno', 'Nombre', 'IDGrupo', 'ApellidoPaterno', 'ApellidoMaterno', 'Curp', 'EsUSAER', 'Estado','NombreCompleto','PromedioBimestre1', 'PromedioBimestre2', 'PromedioBimestre3', 'PromedioBimestre4', 'PromedioBimestre5', 'PromedioTotal', 'ColorPromedio', 'Grupo']}).then(alumnos => {
                if (alumnos.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este alumno no tiene alumnos"
                    })
                } else {
                    console.log(req.body);
                    const date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");

                    Trabajo.create({ IDGrupo: req.body.grupo, Nombre: req.body.nombre, IDBimestre: req.body.bimestre, Fecha: date,
                    Observaciones: req.body.observaciones, Tipo: req.body.tipo}).then(trabajo => {

                        console.log(trabajo);
                        
                        let arrayTrabajosAlumnos = [];

                        const trabajoId = trabajo.dataValues.IDTrabajo;
                        
                        alumnos.forEach(function(alumno) {
                            let trabajosAlumnosObject = {};
                            console.log('alumno');
                            console.log(alumno.dataValues.IDAlumno);
                            trabajosAlumnosObject.IDAlumno = alumno.dataValues.IDAlumno;
                            trabajosAlumnosObject.IDTrabajo = trabajoId;
                            trabajosAlumnosObject.Estado = 1;

                            arrayTrabajosAlumnos.push(trabajosAlumnosObject);
                        }, this);

                        TrabajoAlumno.bulkCreate(arrayTrabajosAlumnos)
                        .then(function(response){
                            res.json({
                                status: 1,
                                data: response,
                                trabajoId
                            })
                        })
                        .catch(function(error){
                            res.json({
                                status: 0,
                                message: "Ha ocurrido un error."
                            })
                        })
                    })
                }
            });
        }
    });
}

module.exports["changeMultipleStatus"] = function (req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if (err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            const alumnoStatus = req.body.alumno;
            const trabajo = req.body.
            
            TrabajoAlumno.bulkCreate(dataArray,
                {
                    fields: ["IDTrabajo", "IDAlumno", "Estado"],
                    updateOnDuplicate: ["IDTrabajo", "IDAlumno"]
                }).then(results => {

                }).catch(err => {

                }
            )
        }
    })
}