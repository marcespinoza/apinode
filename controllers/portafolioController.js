const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');


const env = require('simpledot');
const instanceSequelize = require('../config/sequelize');


module.exports["getInstrumentos"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            const alumno = "'" + req.query.alumno + "'";
            const bimestre = "'" + req.query.bimestre + "'";
            instanceSequelize.query('SELECT "Portafolio"."IDPortafolio","Portafolio"."Nombre","Portafolio"."FechaEntrega","Portafolio"."Descripcion","PortafolioAlumno"."Estado", "PortafolioAlumno"."IDPortafolioAlumno", "Portafolio"."Aspecto1" AS "nombreAspecto1", "Portafolio"."Aspecto2" AS "nombreAspecto2", "Portafolio"."Aspecto3" AS "nombreAspecto3", "Portafolio"."Aspecto4" AS "nombreAspecto4", "Portafolio"."Aspecto5" AS "nombreAspecto5", "Portafolio"."Reactivo1" AS "nombreReactivo1", "Portafolio"."Reactivo2" AS "nombreReactivo2", "Portafolio"."Reactivo3" AS "nombreReactivo3", "Portafolio"."Reactivo4" AS "nombreReactivo4", "Portafolio"."Reactivo5" AS "nombreReactivo5",  "Portafolio"."Activo1" AS "activo1", "Portafolio"."Activo2" AS "activo2", "Portafolio"."Activo3" AS "activo3", "Portafolio"."Activo4" AS "activo4", "Portafolio"."Activo5" AS "activo5", "PortafolioAlumno"."Aspecto1", "PortafolioAlumno"."Aspecto2", "PortafolioAlumno"."Aspecto3", "PortafolioAlumno"."Aspecto4", "PortafolioAlumno"."Aspecto5", "PortafolioAlumno"."IDAlumno" FROM "PortafolioAlumno" INNER JOIN "Portafolio" ON "Portafolio"."IDPortafolio" = "PortafolioAlumno"."IDPortafolio" WHERE  "PortafolioAlumno"."IDAlumno" = '+alumno+' AND "Portafolio"."IDBimestre" = '+bimestre ).then(instrumentos => {
                console.log("instrumentos", instrumentos);
               if (instrumentos.length == 0) {
                res.json({
                    status: 1,
                    message: "Este alumno no tiene instrumentos"
                })
            } else {
                //sumatoria de los estados  
                function groupBy(collection, property) {
                    var i = 0, val, index,
                    values = [], result = [];
                    for (; i < collection.length; i++) {
                        val = collection[i][property];
                        index = values.indexOf(val);
                        console.log('coleccion',collection[i]);

                        let materiasCounter = 0;
                        let reactivosCounter = 0;
                        
                        let aspecto1 = parseInt(collection[i].Aspecto1);

                        let aspecto2 = parseInt(collection[i].Aspecto2);

                        let aspecto3 = parseInt(collection[i].Aspecto3);

                        let aspecto4 = parseInt(collection[i].Aspecto4);
                        
                        let aspecto5 = parseInt(collection[i].Aspecto5);
                        
                        let activo1 = collection[i].activo1;

                        let activo2 = collection[i].activo2;

                        let activo3 = collection[i].activo3;

                        let activo4 = collection[i].activo4;
                        
                        let activo5 = collection[i].activo5;
                        
                        let nombreReactivo1 = parseInt(collection[i].nombreReactivo1);
                        
                        let nombreReactivo2 = parseInt(collection[i].nombreReactivo2);
                        
                        let nombreReactivo3 = parseInt(collection[i].nombreReactivo3);
                        
                        let nombreReactivo4 = parseInt(collection[i].nombreReactivo4);
                        
                        let nombreReactivo5 = parseInt(collection[i].nombreReactivo5);

                        let promedio;

                        console.log(activo1);

                        if (activo1) {
                            materiasCounter++;
                            reactivosCounter = nombreReactivo1 + reactivosCounter;
                        }

                        if (activo2) {
                            materiasCounter++;
                            reactivosCounter = nombreReactivo2 + reactivosCounter;
                        }

                        if (activo3) {
                            materiasCounter++;
                            reactivosCounter = nombreReactivo3 + reactivosCounter;
                        }

                        if (activo4) {
                            materiasCounter++;
                            reactivosCounter = nombreReactivo4 + reactivosCounter;
                        }

                        if (activo5) {
                            materiasCounter++;
                            reactivosCounter = nombreReactivo5 + reactivosCounter;
                        }

                        console.log(aspecto1 + aspecto2 + aspecto3 + aspecto4 + aspecto5)
                        console.log(reactivosCounter)

                        if (materiasCounter > 0) {
                            promedio = ((aspecto1 + aspecto2 + aspecto3 + aspecto4 + aspecto5) / (reactivosCounter)) * 10;
                        } else {
                            promedio = 0;
                        }

                        console.log('promedio' + promedio)

                        if (index > -1){
                         delete collection[i].IDPortafolio; 
                         delete collection[i].IDAlumno;  
                         delete collection[i].Nombre; 
                         delete collection[i].Descripcion;   
                         delete collection[i].Estado; 
                         delete collection[i].FechaEntrega; 

                         result[index]['temas'].push(collection[i]);
                     }
                     else {
                        var nombre = collection[i].Nombre;
                        var idAlumno = collection[i].IDAlumno;
                        var idPortafolio = collection[i].IDPortafolio;
                        var idPortafolioAlumno = collection[i].IDPortafolioAlumno;
                        var estado = collection[i].estado;
                        var descripcion = collection[i].Descripcion;
                        var fechaEntrega = collection[i].FechaEntrega;
                        delete collection[i].IDPortafolio;
                        delete collection[i].IDPortafolioAlumno;
                        delete collection[i].IDAlumno;
                        delete collection[i].Nombre; 
                        delete collection[i].Descripcion;   
                        delete collection[i].Estado; 
                        delete collection[i].FechaEntrega;
                        values.push(val);
                        var examenen = {
                            nombre: nombre,
                            idAlumno: idAlumno,
                            idPortafolioAlumno: idPortafolioAlumno,
                            idPortafolio: idPortafolio,
                            estado: estado,
                            descripcion: descripcion,
                            fechaEntrega: fechaEntrega,
                            promedio: promedio,
                            temas: [collection[i]]
                        };                         
                        result.push(examenen);

                    }
                }
                return result;
            }
            var obj = groupBy(instrumentos[0], "IDPortafolio");
            const data = {
                instrumentos: obj
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

module.exports["getInstrumento"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
                console.log(req.token);
                if(err) {
                    res.json({
                        status: 0,
                        message: "No tiene acceso a este recurso."
                    })
                } else {
                    const portafolio = "'" + req.query.portafolio + "'";
                    const portafolioAlumno = "'" + req.query.portafolioAlumno + "'";
                   // instanceSequelize.query('SELECT "Trabajo"."IDTrabajo", "Trabajo"."IDBimestre", "Trabajo"."Nombre", "Trabajo"."Observaciones", "Trabajo"."Fecha", "Trabajo"."Tipo", "TrabajoAlumno"."Estado" FROM "Trabajo" INNER JOIN "TrabajoAlumno" ON "Trabajo"."IDTrabajo" = "TrabajoAlumno"."IDTrabajo" WHERE "TrabajoAlumno"."IDAlumno"='+ alumno +' AND "Trabajo"."IDBimestre"=' + bimestre + ';').then(trabajos => {
                    instanceSequelize.query('SELECT "Portafolio"."IDPortafolio", "PortafolioAlumno"."IDPortafolioAlumno","Portafolio"."Nombre","Portafolio"."FechaEntrega","Portafolio"."Descripcion","PortafolioAlumno"."Estado", "Portafolio"."Aspecto1" AS "nombreAspecto1", "Portafolio"."Aspecto2" AS "nombreAspecto2", "Portafolio"."Aspecto3" AS "nombreAspecto3", "Portafolio"."Aspecto4" AS "nombreAspecto4", "Portafolio"."Aspecto5" AS "nombreAspecto5", "PortafolioAlumno"."Aspecto1", "PortafolioAlumno"."Aspecto2", "PortafolioAlumno"."Aspecto3", "PortafolioAlumno"."Aspecto4", "PortafolioAlumno"."Aspecto5", "PortafolioAlumno"."IDAlumno" FROM "PortafolioAlumno" INNER JOIN "Portafolio" ON "Portafolio"."IDPortafolio" = "PortafolioAlumno"."IDPortafolio" WHERE "PortafolioAlumno"."IDPortafolio" = ' + portafolio + 'AND "PortafolioAlumno"."IDPortafolioAlumno" = ' + portafolioAlumno).then(instrumentos => {
                        console.log(instrumentos);
                       if (instrumentos.length == 0) {
                        res.json({
                            status: 1,
                            message: "Este alumno no tiene instrumentos"
                        })
                    } else {
                        //sumatoria de los estados  
                        function groupBy(collection, property) {
                            var i = 0, val, index,
                            values = [], result = [];
                            for (; i < collection.length; i++) {
                                val = collection[i][property];
                                index = values.indexOf(val);
        
                                let materiasCounter = 0;
                                
                                let aspecto1 = parseInt(collection[i].Aspecto1);
        
                                let aspecto2 = parseInt(collection[i].Aspecto2);
        
                                let aspecto3 = parseInt(collection[i].Aspecto3);
        
                                let aspecto4 = parseInt(collection[i].Aspecto4);
                                
                                let aspecto5 = parseInt(collection[i].Aspecto5);
        
                                let promedio;
        
                                if (aspecto1 !== 0) {
                                    materiasCounter++;
                                }
        
                                if (aspecto2 !== 0) {
                                    materiasCounter++;
                                }
        
                                if (aspecto3 !== 0) {
                                    materiasCounter++;
                                }
        
                                if (aspecto4 !== 0) {
                                    materiasCounter++;
                                }
        
                                if (aspecto5 !== 0) {
                                    materiasCounter++;
                                }
        
                                if (materiasCounter > 0) {
                                    promedio = (aspecto1 + aspecto2 + aspecto3 + aspecto4 + aspecto5) / materiasCounter;
                                } else {
                                    promedio = 0;
                                }
        
                                console.log('promedio' + promedio)
        
                                if (index > -1){
                                 delete collection[i].IDPortafolio; 
                                 delete collection[i].IDAlumno;  
                                 delete collection[i].Nombre; 
                                 delete collection[i].Descripcion;   
                                 delete collection[i].Estado; 
                                 delete collection[i].FechaEntrega; 
        
                                 result[index]['temas'].push(collection[i]);
                             }
                             else {
                                var nombre = collection[i].Nombre;
                                var idAlumno = collection[i].IDAlumno;
                                var idPortafolio = collection[i].IDPortafolio;
                                var estado = collection[i].estado;
                                var descripcion = collection[i].Descripcion;
                                var fechaEntrega = collection[i].FechaEntrega;
                                delete collection[i].IDPortafolio; 
                                delete collection[i].IDAlumno;  
                                delete collection[i].Nombre; 
                                delete collection[i].Descripcion;   
                                delete collection[i].Estado; 
                                delete collection[i].FechaEntrega;
                                values.push(val);
                                var examenen = {
                                    nombre: nombre,
                                    idAlumno: idAlumno,
                                    idPortafolio: idPortafolio,
                                    estado: estado,
                                    descripcion: descripcion,
                                    fechaEntrega: fechaEntrega,
                                    promedio: promedio,
                                    temas: [collection[i]]
                                };                         
                                result.push(examenen);
        
                            }
                        }
                        return result;
                    }
                    var obj = groupBy(instrumentos[0], "IDPortafolio");
                    const data = {
                        instrumentos: obj
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

    });
}

module.exports["agregarInstrumento"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            const aspecto = req.body.aspecto;
            const nombreAspecto = "'" + req.body.nombreAspecto + "'";
            const activo = req.body.activo;
            const portafolio = "'" + req.body.portafolio + "'";
            const alumno = "'" + req.body.alumno + "'";
            const calificacion = "'" + req.body.calificacion + "'";
            const criterio = req.body.criterio;

            instanceSequelize.query('UPDATE "Portafolio" SET "Aspecto' + criterio + '" = ' + nombreAspecto + ', "Activo' + criterio + '"' + " = 'true'" + ', "Criterio' + criterio  +  '"= ' + "'10'" + ', "Reactivo' + criterio + '"' + " = '2'" + ' WHERE "IDPortafolio" = ' + portafolio).then(instrumentos => {
                instanceSequelize.query('UPDATE "PortafolioAlumno" SET "Aspecto' + criterio + '" = ' + calificacion + ' WHERE "IDPortafolio" = ' + portafolio + ' AND "IDAlumno" = ' + alumno ).then(instrumento => {
                    if (instrumentos.length == 0) {
                        res.json({
                            status: 1,
                            message: "Este usuario no tiene instrumentos."
                        })
                    } else {
                        res.json({
                            status: 1,
                            message: "Aspecto agregado"
                        })
                    }
                })
            })
        }
    })
}

module.exports["updateCalificacionInstrumento"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            const alumno = "'" + req.body.alumno + "'";
            const portafolio = "'" + req.body.portafolio + "'";
            const calificacion = "'" + req.body.calificacion + "'";
            const aspecto = req.body.aspecto;

            instanceSequelize.query('UPDATE "PortafolioAlumno" SET "' + aspecto + '" = ' + calificacion + ' WHERE "IDPortafolio" = ' + portafolio + ' AND "IDAlumno" = '+ alumno ).then(instrumentos => {
                console.log(instrumentos);
                if (instrumentos.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene instrumentos."
                    })
                } else {
                    res.json({
                        status: 1,
                        message: "Calificacion actualizada"
                    })
                }
            })
        }
    })
}