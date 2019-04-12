const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const Alumno = require('../models/alumno');
const Bimestre = require('../models/bimestre');
const AlumnoDesempenio = require('../models/alumno-desempenio');
const AlumnoSesion = require('../models/alumno-sesion');
const env = require('simpledot');
var request = require('request');
const cheerio = require('cheerio');
const urlLogin = 'http://app.mastertools.mx/Account/Login'; 
var j = request.jar();
var request = request.defaults({jar:j});

module.exports["getAlumnos"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            Alumno.findAll({where: {IDGrupo: req.query.grupo}, attributes: ['IDAlumno', 'Nombre', 'IDGrupo', 'ApellidoPaterno', 'ApellidoMaterno', 'Curp', 'EsUSAER', 'Estado','NombreCompleto','PromedioBimestre1', 'PromedioBimestre2', 'PromedioBimestre3', 'PromedioBimestre4', 'PromedioBimestre5', 'PromedioTotal', 'ColorPromedio', 'Grupo']}).then(alumno => {
                if (alumno.length == 0) {
                    res.json({
                        status: 0,
                        message: "Este usuario no tiene grupos."
                    })
                } else {
                    const data = {
                        alumnos: alumno
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


module.exports["setAlumno"] = function (req,res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        console.log(req.body);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {

            const options = {
                url: urlLogin
            }
            request(options, (error, response, body) => {    
                if (error) {
                    res.json({
                        status: 0,
                        message: "Ha ocurrido un error"
                    })
                } else {
        
                    const $ = cheerio.load(body)
                    const requestVerification = $('input[name=__RequestVerificationToken]').attr('value')
                    const email = 'cyan.ivan@gmail.com'
                    const pass = 'alonso123'
        
                    var options = { method: 'POST',
                    url: urlLogin,
                    headers: 
                     { 'Content-Type': 'application/x-www-form-urlencoded',
                       'X-Requested-With': 'XMLHttpRequest' },
                    form: 
                     { __RequestVerificationToken: requestVerification,
                       Email: email,
                       Password: pass,
                       RememberMe: 'false' } };
                  
                    request(options, function (error, responseLogin, body) {
                        if (error) {
                            res.json({
                                status: 0,
                                message: "Ha ocurrido un error"
                            })
                        }
                        
                        var options = { method: 'POST',
                        url: `http://app.mastertools.mx/alumnos/GuardarAlumno`,
                        headers: 
                         { 'Content-Type': 'application/x-www-form-urlencoded',
                           'X-Requested-With': 'XMLHttpRequest' },
                        form: 
                         { IDAlumno: "00000000-0000-0000-0000-000000000000",
                           IDGrupo : req.body.group,
                           Nombre: req.body.nombre,
                           ApellidoPaterno: req.body.lastname,
                           ApellidoMaterno: req.body.midlename,
                           Curp: req.body.curp,
                           EsUSAER: req.body.esnee} };
                      
                        request(options, function (error, responseLogin, body) {
                            if (error) {
                                res.json({
                                    status: 0,
                                    message: "Ha ocurrido un error"
                                })
                            } else {
                                res.json({
                                    status: 1,
                                    message: "Usuario creado"
                                })                                
                            }
       
                        });

                    });
                  
                }
            })
        }
    });  
}

module.exports["getAlumno"] = function (req, res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            Alumno.findOne({where: {IDAlumno: req.query.alumno}, attributes: ['IDAlumno', 'Nombre', 'IDGrupo', 'ApellidoPaterno', 'ApellidoMaterno', 'Curp','EsUSAER', 'Estado','NombreCompleto','PromedioBimestre1', 'PromedioBimestre2', 'PromedioBimestre3', 'PromedioBimestre4', 'PromedioBimestre5', 'PromedioTotal', 'ColorPromedio', 'Grupo']}).then(alumno => {
                if (alumno.length == 0) {
                    res.json({
                        status: 0,
                        message: "Este usuario no tiene grupos.",
                        data: []
                    })
                } else {
                    const data = {
                        alumno: alumno
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
module.exports["getAlumnoAsistencia"] = function (req, res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            AlumnoSesion.findAll({where: {
                IDAlumno: req.query.alumno,
                IDGrupo: req.query.grupo
            }, attributes: ['IDAlumno','IDGrupo','IDSesion']}).then(asistencia => {
                if (asistencia.length == 0) {
                    res.json({
                        status: 0,
                        message: "Este usuario no tiene asistencia.",
                        data: []
                    })
                } else {
                    console.log(asistencia);
                    const data = {
                        asistencia: asistencia
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
//todo terminar de actualizar 
module.exports["updateAlumno"] = function (req,res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        console.log(req.body);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
          Alumno.update(
          { 
            Nombre: req.body.nombre,
            ApellidoPaterno: req.body.lastname,
            ApellidoMaterno: req.body.midlename,
            Curp: req.body.curp,
            EsUSAER: req.body.esnee, 
            IDGrupo: req.body.group
        },
        { where: { IDAlumno: req.body.alumno } }
        ).then(function(dbResult){
            if (dbResult == 0) {
                res.json({
                    status: 0,
                    message: "Error al modificar datos del Alumno",
                    data: []

                })
            }else{
              res.json({
                status: 1,
                message: "El alumno fue modificado con exito",
                data: [],
            })
          }

      });
    }
});  
}
//eliminar alumno
module.exports["deleteAlumno"] = function (req,res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        console.log(req.body);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            Alumno
            .findById(req.query.idAlumno)
            .then(alumno => {
              if (!alumno) {
                res.json({
                    status: 0,
                    message: "Alumno no encontrado."
                })
              }
              return alumno
                .destroy()
                .then(() => res.json({
                    status: 0,
                    message: "Alumno eliminado."
                }))
                .catch((error) => res.json({
                    status: 0,
                    message: "Error al eliminar."
                }));
            })
            .catch((error) => res.status(400).send(error));
        
    }
});  
}
