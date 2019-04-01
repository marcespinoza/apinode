const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const Grupo = require('../models/grupo');
const Bimestre = require('../models/bimestre');
const HabilidadAlumno = require('../models/habilidad-alumno');
const env = require('simpledot');

module.exports["getHabilidadesAlumno"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            HabilidadAlumno.findAll({where: {IDAlumno: req.query.alumno, IDBimestre: req.query.bimestre, IDGrupo: req.query.grupo}, attributes: ['Autoevaluacion', 'Coevaluacion', 'Comprension', 'Conocimiento', 'Sintesis', 'Argumentacion','ApoyoLectura','ApoyoEscritura','ApoyoMatematicas', 'SeInvolucraClase']}).then(habilidad => {
                if (habilidad.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene grupos."
                    })
                } else {
                    const data = {
                        habilidad: habilidad
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

module.exports["postHabilidadesAlumno"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {

            const fields = {
                IDAlumno: req.body.alumno,
                IDBimestre: req.body.bimestre,
                IDGrupo: req.body.grupo,
                Autoevaluacion: req.body.evaluacion,
                Coevaluacion: req.body.coevaluacion,
                Comprension: req.body.comprension,
                Conocimiento: req.body.conocimiento,
                Sintesis: req.body.sintesis,
                Argumentacion: req.body.argumentacion,
                ApoyoLectura: req.body.apoyoLectura,
                ApoyoEscritura: req.body.apoyoEscritura,
                ApoyoMatematicas: req.body.apoyoMatematicas,
                SeInvolucraClase: req.body.seInvolucraClase
            };
            
            HabilidadAlumno.create(fields).then(habilidad => {
                if (habilidad.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene grupos.",
                        data: habilidad
                    })
                } else {
                    
                    res.json({
                        status: 1,
                        message: "Habilidad creada"
                    })
                }
            });
        }
    });
}

module.exports["updateHabilidadesAlumno"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {

            const fields = {
                Autoevaluacion: req.body.evaluacion,
                Coevaluacion: req.body.coevaluacion,
                Comprension: req.body.comprension,
                Conocimiento: req.body.conocimiento,
                Sintesis: req.body.sintesis,
                Argumentacion: req.body.argumentacion,
                ApoyoLectura: req.body.apoyoLectura,
                ApoyoEscritura: req.body.apoyoEscritura,
                ApoyoMatematicas: req.body.apoyoMatematicas,
                SeInvolucraClase: req.body.seInvolucraClase
            };
            
            HabilidadAlumno.update(fields, {where: {
                IDAlumno: req.body.alumno,
                IDBimestre: req.body.bimestre,
                IDGrupo: req.body.grupo,
            }}).then(habilidad => {
                if (habilidad.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene grupos.",
                        data: habilidad
                    })
                } else {
                    res.json({
                        status: 1,
                        message: "Habilidad actualizada"
                    })
                }
            });
        }
    });
}