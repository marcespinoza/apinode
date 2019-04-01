const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const env = require('simpledot');
const instanceSequelize = require('../config/sequelize');
const Alumno = require('../models/alumno');
const ExamenAlumno = require('../models/examen-alumno');
const ExamenTema = require('../models/examen-tema');

module.exports["getExamen"] = function(req, res) {
	jwt.verify(req.token, env.SECRET_HASH, function(err, data) {
		console.log(req.token);
		if (err) {
			res.json({
				status: 0,
				message: "No tiene acceso a este recurso."
			})
		} else {
			console.log(data);
			const alumno = "'" + req.query.alumno + "'";
			const bimestre = "'" + req.query.bimestre + "'";
			const examen = "'" + req.query.examen + "'";
			// instanceSequelize.query('SELECT "Trabajo"."IDTrabajo", "Trabajo"."IDBimestre", "Trabajo"."Nombre", "Trabajo"."Observaciones", "Trabajo"."Fecha", "Trabajo"."Tipo", "TrabajoAlumno"."Estado" FROM "Trabajo" INNER JOIN "TrabajoAlumno" ON "Trabajo"."IDTrabajo" = "TrabajoAlumno"."IDTrabajo" WHERE "TrabajoAlumno"."IDAlumno"='+ alumno +' AND "Trabajo"."IDBimestre"=' + bimestre + ';').then(trabajos => {
			instanceSequelize.query('SELECT "Bimestres"."Bimestre","Bimestres"."IDBimestre", "ExamenTema"."IDTema","Examen"."IDExamen","ExamenTema"."Nombre","Examen"."Titulo","Examen"."Tipo", "Examen"."FechaEntrega", "ExamenAlumno"."Calificacion" FROM "ExamenAlumno" INNER JOIN "ExamenTema" ON "ExamenAlumno"."IDTema" = "ExamenTema"."IDTema"  INNER JOIN "Examen" ON "Examen"."IDExamen" = "ExamenTema"."IDExamen"  INNER JOIN "Bimestres" ON "Bimestres"."IDBimestre" = "Examen"."IDBimestre" WHERE  "ExamenAlumno"."IDAlumno" = ' + alumno + ' AND "Examen"."IDExamen" = ' + examen).then(examenes => {
				if (examenes.length == 0) {
					res.json({
						status: 1,
						message: "Este alumno no tiene examenes"
					})
				} else {
					//sumatoria de los estados  
					function groupBy(collection, property) {
						var i = 0,
							val, index,
							values = [],
							result = [];
						for (; i < collection.length; i++) {
							val = collection[i][property];
							index = values.indexOf(val);
							if (index > -1) {
								delete collection[i].Titulo;
								delete collection[i].Tipo;
								delete collection[i].FechaEntrega;
								result[index]['temas'].push(collection[i]);
							} else {
								var titulo = collection[i].Titulo;
								var tipo = collection[i].Tipo;
								var fechaEntrega = collection[i].FechaEntrega;
								var IDExamen = collection[i].IDExamen;
								delete collection[i].Titulo;
								delete collection[i].Tipo;
								delete collection[i].FechaEntrega;
								delete collection[i].IDExamen;
								values.push(val);
								var examenen = {
									titulo: titulo,
									tipo: tipo,
									fechaEntrega: fechaEntrega,
									idExamen: IDExamen,
									temas: [collection[i]]
								};
								result.push(examenen);
							}
						}
						return result;
					}
					var obj = groupBy(examenes[0], "IDExamen");
					const data = {
						examenes: obj
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

module.exports["getExamenes"] = function(req, res) {
	jwt.verify(req.token, env.SECRET_HASH, function(err, data) {
		console.log(req.token);
		if (err) {
			res.json({
				status: 0,
				message: "No tiene acceso a este recurso."
			})
		} else {
			console.log(data);
			const alumno = "'" + req.query.alumno + "'";
			const bimestre = "'" + req.query.bimestre + "'";
			// instanceSequelize.query('SELECT "Trabajo"."IDTrabajo", "Trabajo"."IDBimestre", "Trabajo"."Nombre", "Trabajo"."Observaciones", "Trabajo"."Fecha", "Trabajo"."Tipo", "TrabajoAlumno"."Estado" FROM "Trabajo" INNER JOIN "TrabajoAlumno" ON "Trabajo"."IDTrabajo" = "TrabajoAlumno"."IDTrabajo" WHERE "TrabajoAlumno"."IDAlumno"='+ alumno +' AND "Trabajo"."IDBimestre"=' + bimestre + ';').then(trabajos => {
			instanceSequelize.query('SELECT "Bimestres"."Bimestre","Bimestres"."IDBimestre", "ExamenTema"."IDTema","Examen"."IDExamen","ExamenTema"."Nombre","ExamenTema"."Reactivos","Examen"."Titulo","Examen"."Tipo", "Examen"."FechaEntrega", "ExamenAlumno"."Calificacion" FROM "ExamenAlumno" INNER JOIN "ExamenTema" ON "ExamenAlumno"."IDTema" = "ExamenTema"."IDTema"  INNER JOIN "Examen" ON "Examen"."IDExamen" = "ExamenTema"."IDExamen"  INNER JOIN "Bimestres" ON "Bimestres"."IDBimestre" = "Examen"."IDBimestre" WHERE  "ExamenAlumno"."IDAlumno" = ' + alumno + ' AND "Examen"."IDBimestre" = ' + bimestre).then(examenes => {
				// console.log("examenes", examenes);
				if (examenes.length == 0) {
					res.json({
						status: 1,
						message: "Este alumno no tiene examenes"
					})
				} else {
					//sumatoria de los estados  
					function groupBy(collection, property) {
						var i = 0,
							val, index,
							values = [],
							result = [];
						for (; i < collection.length; i++) {
							val = collection[i][property];
							index = values.indexOf(val);
							if (index > -1) {
								delete collection[i].Titulo;
								delete collection[i].Tipo;
								delete collection[i].FechaEntrega;
								delete collection[i].promediototal;
								result[index]['temas'].push(collection[i]);
							} else {
								var titulo = collection[i].Titulo;
								var tipo = collection[i].Tipo;
								var fechaEntrega = collection[i].FechaEntrega;
								var IDExamen = collection[i].IDExamen;
								delete collection[i].Titulo;
								delete collection[i].Tipo;
								delete collection[i].FechaEntrega;
								delete collection[i].IDExamen;
								values.push(val);
								var examenen = {
									titulo: titulo,
									tipo: tipo,
									fechaEntrega: fechaEntrega,
									idExamen: IDExamen,
									temas: [collection[i]]
								};
								console.log("examenen", examenen);
								result.push(examenen);
							}
						}
						return result;
					}
					var obj = groupBy(examenes[0], "IDExamen");
					let final = [];
					obj.forEach(el => {
						let reactivosCounter = 0;
						let calificacionesCounter = 0;

						el.temas.forEach(tema => {
							reactivosCounter = reactivosCounter + tema.Reactivos;
							calificacionesCounter = calificacionesCounter + tema.Calificacion;
						});

						let promediototal = (calificacionesCounter / reactivosCounter) * 10;
						console.log(calificacionesCounter, reactivosCounter, promediototal);
						el.promediototal = promediototal;
						final.push(el);
					})
					const data = {
						examenes: final
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

module.exports["postTema"] = function(req, res) {
	jwt.verify(req.token, env.SECRET_HASH, function(err, data) {
		console.log(req.token);
		if (err) {
			res.json({
				status: 0,
				message: "No tiene acceso a este recurso."
			})
		} else {
            Alumno.findAll({where: {IDGrupo: req.body.grupo}, attributes: ['IDAlumno']}).then(alumnos => {
                if (alumnos.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este grupo no tiene alumnos"
                    })
                } else {
                    ExamenTema.create({ IDExamen: req.body.examen, Nombre: req.body.nombre}).then(tema => {
                        
                        let arrayTemaAlumno = [];

                        const temaId = tema.dataValues.IDTema;

                        alumnos.forEach(function(alumno) {
                            let alumnosTemaObject = {};
                            alumnosTemaObject.IDAlumno = alumno.dataValues.IDAlumno;
                            alumnosTemaObject.IDTema = tema.dataValues.IDTema;
                            alumnosTemaObject.Calificacion = 0;
                            arrayTemaAlumno.push(alumnosTemaObject);
                        }, this);

                        ExamenAlumno.bulkCreate(arrayTemaAlumno)
                        .then(function(response){
							ExamenAlumno.update({Calificacion: req.body.calificacion}, { where: { IDAlumno: req.body.alumno, IDTema: tema.dataValues.IDTema } }).then(function(examenAlumno) {
								res.json({
									status: 1,
									message: "Se ha creado el tema"
								})
							})
							.catch(function(error){
								console.log(error);
								res.json({
									status: 0,
									message: "Ha ocurrido un error."
								})
							})
						})
                        .catch(function(error){
                            console.log(error);
                            res.json({
                                status: 0,
                                message: "Ha ocurrido un error."
                            })
                        })
                    })
                }
            })
		}
	});
}

module.exports["updateTemaCalificacion"] = function(req, res) {
	jwt.verify(req.token, env.SECRET_HASH, function(err, data) {
		console.log(req.token);
		if (err) {
			res.json({
				status: 0,
				message: "No tiene acceso a este recurso."
			})
		} else {
			ExamenAlumno.update({Calificacion: req.body.calificacion}, { where: { IDAlumno: req.body.alumno, IDTema: req.body.tema } }).then(function(examenAlumno) {
				res.json({
					status: 1,
					message: "Se ha actualizado la calificacion"
				})
			})
			.catch(function(error){
				console.log(error);
				res.json({
					status: 0,
					message: "Ha ocurrido un error."
				})
			})
		}
	});
}