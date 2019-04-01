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
            const alumno = "'" + req.query.alumno + "'";
            const bimestre = "'" + req.query.bimestre + "'";
           // instanceSequelize.query('SELECT "Trabajo"."IDTrabajo", "Trabajo"."IDBimestre", "Trabajo"."Nombre", "Trabajo"."Observaciones", "Trabajo"."Fecha", "Trabajo"."Tipo", "TrabajoAlumno"."Estado" FROM "Trabajo" INNER JOIN "TrabajoAlumno" ON "Trabajo"."IDTrabajo" = "TrabajoAlumno"."IDTrabajo" WHERE "TrabajoAlumno"."IDAlumno"='+ alumno +' AND "Trabajo"."IDBimestre"=' + bimestre + ';').then(trabajos => {
            instanceSequelize.query('SELECT "Trabajo"."IDTrabajo","Trabajo"."Tipo","Trabajo"."Fecha" ,"Trabajo"."Nombre" ,"Trabajo"."IDBimestre", "Trabajo"."Observaciones","TrabajoAlumno"."Estado"   FROM "Trabajo" INNER JOIN "TrabajoAlumno" ON "TrabajoAlumno"."IDTrabajo" = "Trabajo"."IDTrabajo" INNER JOIN "Bimestres" ON "Bimestres"."IDBimestre" = "Trabajo"."IDBimestre" WHERE "TrabajoAlumno"."IDAlumno" = '+alumno+' AND "Trabajo"."IDBimestre" ='+bimestre).then(trabajos => {
                console.log(trabajos);
                if (trabajos.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este alumno no tiene trabajos"
                })
            } else {
                //sumatoria de los estados 
                var entregados = 0;
                var noEntregados = 0;
                var incompletos = 0;
                

                for (var i = 0; i < trabajos[0].length; i++) {

                    if (trabajos[0][i].Estado == 0) {
                        noEntregados = noEntregados+1;
                    }
                    if (trabajos[0][i].Estado == 1) {
                        entregados = entregados+1;
                    }
                    if (trabajos[0][i].Estado == 2) {
                        incompletos = incompletos+1;
                    }

                }

                const data = {
                    entregados: entregados,
                    noEntregados: noEntregados,
                    incompletos: incompletos,
                    trabajos: trabajos[0]
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

module.exports["estadoTrabajoAlumno"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            TrabajoAlumno.update({Estado: req.body.estado}, { where: { IDAlumno: req.body.alumno, IDTrabajo: req.body.trabajo } }).then(function(dbResult) {
                res.json({
                    status: 1,
                    message: "El estado ha sido actualizado"
                })
            }).catch(function(err) {
                res.json({
                    status: 0,
                    message: "Ha ocurrido un error."
                })
            });
        }
    });
}