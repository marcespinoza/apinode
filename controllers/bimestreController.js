const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const Grupo = require('../models/grupo');
const Bimestre = require('../models/bimestre');
const Alumno = require('../models/alumno');
const AlumnoSesion = require('../models/alumno-sesion');
const instanceSequelize = require('../config/sequelize');

const Sesion = require('../models/sesion');
const env = require('simpledot');

module.exports["getAlumnosBimestre"] = function(req, res) {
    // getAlumnosBimestre: este servicio te devuelve todos los alumnos
    // registrados en este bimestre 
    // paramatros grupo 'UUID' , bimestre 'INT'
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso.",
                data: []

            })
        } else {
            Bimestre.findAll({where: {
                IDGrupo: req.query.grupo, 
                Bimestre: req.query.bimestre, 
            }, attributes: [
            'IDBimestre', 
            ]}).then(group => {

                if (group.length == 0) {
                    res.json({
                        status: 1,
                        message: "No existe bimestre para este grupo",
                        data: []
                    })
                } else {
                    Alumno.findAll({where: {
                        IDGrupo: req.query.grupo 
                    }, order: [
                        ['ApellidoPaterno', 'ASC'],
                    ], attributes: [
                    'Estado',
                    'ApellidoPaterno',
                    'ApellidoMaterno',
                    'IDAlumno',
                    'Nombre',
                    ]}).then(alumno => {
                        console.log('askdnaosndoa');
                        console.log(alumno);
                        if (alumno.length == 0) {
                            res.json({
                                status: 1,
                                message: "No tiene Alumno",
                                data: []
                            })
                        } else {
                            const data = {
                                alumnos: alumno
                            }
                            res.json({
                                status: 1,
                                IDGrupo: req.query.grupo,
                                IDBimestre: group[0].IDBimestre,
                                data: data
                            })
                        }
                    });
                }
            });
        }
    });
}


module.exports["createAsistenciaSesion"] = function(req, res) {
    console.log(req.body.fecha);
    // createAsistenciaSesion: este servicio crea  una sesion  luego
    //guarda por cada alumno un alumnoSesion que es la asistencia como tal
    var asistencias = JSON.parse(req.body.asistencia);
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso.",
                data: []
            })
        } else {
            Sesion.create({ 
                IDGrupo: req.body.grupo ,
                IDBimestre: req.body.bimestre,
                Fecha: req.body.fecha
            }).then(sesion => {
                var promises = asistencias.map(function(asistencia){
                    console.log(asistencia);
                    return AlumnoSesion.create( {
                        IDSesion: sesion.IDSesion,
                        IDAlumno: asistencia.IDAlumno,
                        Estado: asistencia.Estado,
                        
                    });
                });
                Promise.all(promises).then(function(dbResult){
                 res.json({
                    status: 1,
                    message: "La asistencia fue creado",
                    data: {IDSesion : sesion.IDSesion},
                })
             });
            })
        }
    });
}

module.exports["showAsistenciaAlumno"] = function(req, res) {
    var bimestre = "'"+req.query.bimestre+"'";
    var alumno =  "'"+req.query.alumno+"'";
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso.",
                data: []
            })
        } else {
            instanceSequelize.query('SELECT "Sesion"."IDSesion", "Sesion"."Fecha", "AlumnoSesion"."IDAlumno", "AlumnoSesion"."Estado" FROM "Sesion" INNER JOIN "AlumnoSesion" ON "Sesion"."IDSesion" = "AlumnoSesion"."IDSesion" WHERE "Sesion"."IDBimestre" = '+bimestre+' AND "AlumnoSesion"."IDAlumno" = '+alumno+' order by "Fecha" DESC;').then(function(users) {

                var inasistencias = 0;
                for (var i = 0; i < users[0].length; i++) {
                    if (users[0][i].Estado == 0) {
                        inasistencias = inasistencias+1;
                    }

                }
                const data = {
                    asistencias: users[0].length - inasistencias,
                    inasistencias: inasistencias,
                    data: users[0]
                }
                res.json({
                    status: 1,
                    message: "",
                    data: data,
                })
                
            });

        }
    });

}


module.exports["changeAsistenciaAlumno"] = function(req, res) {
    var IdSesion =  req.body.sesion;
    var alumno =  req.body.alumno;
    var estado =  req.body.estado ;
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            AlumnoSesion.update(
                { Estado: estado },
                { where: { IDAlumno: alumno, IDSesion: IdSesion } }
                ).then(function(dbResult){
                    if (dbResult == 0) {
                        res.json({
                            status: 0,
                            message: "Error al modificar la Asistencia",
                            data: []
                        })
                    }else{
                      res.json({
                        status: 1,
                        message: "La asistencia fue modificada con exito",
                        data: [],
                    })
                  }

              });
            }
        });
}



