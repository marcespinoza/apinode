const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const env = require('simpledot');
const instanceSequelize = require('../config/sequelize');
const Promise = require('bluebird');
var request = require('request');
const cheerio = require('cheerio');
const urlLogin = 'http://app.mastertools.mx/Account/Login'; 
var j = request.jar();
var request = request.defaults({jar:j});

const getControlInstrumentos = function (req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        if (err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            const alumno = "'" + req.query.alumno + "'";
            const bimestre = "'" + req.query.bimestre + "'";
            instanceSequelize.query('SELECT * FROM (select tp."Nombre",(sum(cast(pa."Aspecto1" as int)+cast(pa."Aspecto2" as int)+cast(pa."Aspecto3" as int)+cast(pa."Aspecto4" as int) +cast(pa."Aspecto5" as int))/ sum(pf."Reactivo1"+pf."Reactivo2"+pf."Reactivo3"+pf."Reactivo4"+pf."Reactivo5"))*10 as Total from dbo."Portafolio" pf JOIN dbo."PortafolioAlumno" pa ON pa."IDPortafolio" = pf."IDPortafolio" JOIN dbo."TipoPortafolio" tp ON tp."IDTipoPortafolio" = pf."IDTipoPortafolio" JOIN dbo."Bimestres" b ON b."IDBimestre" = pf."IDBimestre" where "IDAlumno" = ' + alumno + ' and b."Bimestre" = ' + req.query.bimestre + ' group by tp."Nombre" Union Distinct SELECT e."Titulo", ( sum(ea."Calificacion") / sum(et."Reactivos"))*10 as total FROM dbo."ExamenAlumno" ea JOIN dbo."ExamenTema" et ON et."IDTema" = ea."IDTema" JOIN dbo."Examen" e on e."IDExamen" = et."IDExamen" JOIN dbo."Bimestres" b on b."IDBimestre" = e."IDBimestre" where ea."IDAlumno" = ' + alumno + ' and b."Bimestre" = ' + req.query.bimestre + ' and e."Titulo" IN (\'Parcial 1\',\'Parcial 2\',\'Bimestral 1\') GROUP BY e."Titulo" Union Distinct SELECT column_name as Nombre,h."Autoevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Autoevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = ' + req.query.bimestre + ' Union Distinct SELECT column_name as Nombre,h."Coevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Coevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = '+ req.query.bimestre+' Union Distinct SELECT column_name as Nombre,(ad."PromedioTrabajo"/10) as Trabajos FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'AlumnoDesempenio\' AND column_name LIKE \'PromedioTrabajo\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = ' + req.query.bimestre +') AS control order by CASE control."Nombre" WHEN \'Parcial 1\' then 1  WHEN \'Parcial 2\' THEN 2 WHEN \'Bimestral 1\' THEN 3 WHEN \'Trimestral\' THEN 4 WHEN \'PromedioTrabajo\' THEN 5 WHEN \'Mapa Mental\'  THEN 6 WHEN \'Autoevaluacion\' THEN 7 WHEN \'Coevaluacion\' THEN 8 end').then(instrumentos => {
                console.log(instrumentos);  
                if (instrumentos.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este alumno no tiene instrumentos"
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
                            console.log(instrumentos);   
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
                                var options = {
                                url: 'http://app.mastertools.mx/alumnos/CargarReporte?grupo=175946df-d5fc-4115-a684-feb2906b0366&bimestre=1' };
                              
                                request(options, function (error, responseJson, body) {
                                    if (error) {
                                        res.json({
                                            status: 0,
                                            message: "Ha ocurrido un error"
                                        })
                                    }  
                                    const report = JSON.parse(body);  
                                    const instrumentosPonderacion = instrumentos[0].map(function(x) {
                                        const header = report.headers.filter(header => header.name.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") == x.Nombre.trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                                        x.ponderacion = 0                                        
                                        if (header[0]) {
                                            x.ponderacion = header[0].porcentaje
                                        }
                                        return x;
                                     });


                                    const data = {
                                        instrumentos: instrumentosPonderacion
                                    }
                                    res.json({
                                        status: 1,
                                        data
                                    })

                                });                
                            });
                          
                        }
                    })


                }
            });
        }
    });
}

const getControlInstrumentosBimestres = function (req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if (err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            const alumno = "'" + req.query.alumno + "'";
            Promise.props({
                instrumentos1: instanceSequelize.query('select tp."Nombre",(sum(cast(pa."Aspecto1" as int)+cast(pa."Aspecto2" as int)+cast(pa."Aspecto3" as int)+cast(pa."Aspecto4" as int) +cast(pa."Aspecto5" as int))/ sum(pf."Reactivo1"+pf."Reactivo2"+pf."Reactivo3"+pf."Reactivo4"+pf."Reactivo5"))*10 as Total from dbo."Portafolio" pf JOIN dbo."PortafolioAlumno" pa ON pa."IDPortafolio" = pf."IDPortafolio" JOIN dbo."TipoPortafolio" tp ON tp."IDTipoPortafolio" = pf."IDTipoPortafolio" JOIN dbo."Bimestres" b ON b."IDBimestre" = pf."IDBimestre" where "IDAlumno" = ' + alumno + ' and b."Bimestre" = 1 group by tp."Nombre" Union Distinct SELECT e."Titulo", ( sum(ea."Calificacion") / sum(et."Reactivos"))*10 as total FROM dbo."ExamenAlumno" ea JOIN dbo."ExamenTema" et ON et."IDTema" = ea."IDTema" JOIN dbo."Examen" e on e."IDExamen" = et."IDExamen" JOIN dbo."Bimestres" b on b."IDBimestre" = e."IDBimestre" where ea."IDAlumno" = ' + alumno + ' and b."Bimestre" = 1 and e."Titulo" IN (\'Parcial 1\',\'Parcial 2\',\'Bimestral 1\') GROUP BY e."Titulo" Union Distinct SELECT column_name as Nombre,h."Autoevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Autoevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,h."Coevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Coevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,(ad."PromedioTrabajo"/10) as Trabajos FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'AlumnoDesempenio\' AND column_name LIKE \'PromedioTrabajo\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1'),
                instrumentos2: instanceSequelize.query('select tp."Nombre",(sum(cast(pa."Aspecto1" as int)+cast(pa."Aspecto2" as int)+cast(pa."Aspecto3" as int)+cast(pa."Aspecto4" as int) +cast(pa."Aspecto5" as int))/ sum(pf."Reactivo1"+pf."Reactivo2"+pf."Reactivo3"+pf."Reactivo4"+pf."Reactivo5"))*10 as Total from dbo."Portafolio" pf JOIN dbo."PortafolioAlumno" pa ON pa."IDPortafolio" = pf."IDPortafolio" JOIN dbo."TipoPortafolio" tp ON tp."IDTipoPortafolio" = pf."IDTipoPortafolio" JOIN dbo."Bimestres" b ON b."IDBimestre" = pf."IDBimestre" where "IDAlumno" = ' + alumno + ' and b."Bimestre" = 2 group by tp."Nombre" Union Distinct SELECT e."Titulo", ( sum(ea."Calificacion") / sum(et."Reactivos"))*10 as total FROM dbo."ExamenAlumno" ea JOIN dbo."ExamenTema" et ON et."IDTema" = ea."IDTema" JOIN dbo."Examen" e on e."IDExamen" = et."IDExamen" JOIN dbo."Bimestres" b on b."IDBimestre" = e."IDBimestre" where ea."IDAlumno" = ' + alumno + ' and b."Bimestre" = 2 and e."Titulo" IN (\'Parcial 1\',\'Parcial 2\',\'Bimestral 1\') GROUP BY e."Titulo" Union Distinct SELECT column_name as Nombre,h."Autoevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Autoevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,h."Coevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Coevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,(ad."PromedioTrabajo"/10) as Trabajos FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'AlumnoDesempenio\' AND column_name LIKE \'PromedioTrabajo\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1'),
                instrumentos3: instanceSequelize.query('select tp."Nombre",(sum(cast(pa."Aspecto1" as int)+cast(pa."Aspecto2" as int)+cast(pa."Aspecto3" as int)+cast(pa."Aspecto4" as int) +cast(pa."Aspecto5" as int))/ sum(pf."Reactivo1"+pf."Reactivo2"+pf."Reactivo3"+pf."Reactivo4"+pf."Reactivo5"))*10 as Total from dbo."Portafolio" pf JOIN dbo."PortafolioAlumno" pa ON pa."IDPortafolio" = pf."IDPortafolio" JOIN dbo."TipoPortafolio" tp ON tp."IDTipoPortafolio" = pf."IDTipoPortafolio" JOIN dbo."Bimestres" b ON b."IDBimestre" = pf."IDBimestre" where "IDAlumno" = ' + alumno + ' and b."Bimestre" = 3 group by tp."Nombre" Union Distinct SELECT e."Titulo", ( sum(ea."Calificacion") / sum(et."Reactivos"))*10 as total FROM dbo."ExamenAlumno" ea JOIN dbo."ExamenTema" et ON et."IDTema" = ea."IDTema" JOIN dbo."Examen" e on e."IDExamen" = et."IDExamen" JOIN dbo."Bimestres" b on b."IDBimestre" = e."IDBimestre" where ea."IDAlumno" = ' + alumno + ' and b."Bimestre" = 3 and e."Titulo" IN (\'Parcial 1\',\'Parcial 2\',\'Bimestral 1\') GROUP BY e."Titulo" Union Distinct SELECT column_name as Nombre,h."Autoevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Autoevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,h."Coevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Coevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,(ad."PromedioTrabajo"/10) as Trabajos FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'AlumnoDesempenio\' AND column_name LIKE \'PromedioTrabajo\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1'),
                instrumentos4: instanceSequelize.query('select tp."Nombre",(sum(cast(pa."Aspecto1" as int)+cast(pa."Aspecto2" as int)+cast(pa."Aspecto3" as int)+cast(pa."Aspecto4" as int) +cast(pa."Aspecto5" as int))/ sum(pf."Reactivo1"+pf."Reactivo2"+pf."Reactivo3"+pf."Reactivo4"+pf."Reactivo5"))*10 as Total from dbo."Portafolio" pf JOIN dbo."PortafolioAlumno" pa ON pa."IDPortafolio" = pf."IDPortafolio" JOIN dbo."TipoPortafolio" tp ON tp."IDTipoPortafolio" = pf."IDTipoPortafolio" JOIN dbo."Bimestres" b ON b."IDBimestre" = pf."IDBimestre" where "IDAlumno" = ' + alumno + ' and b."Bimestre" = 4 group by tp."Nombre" Union Distinct SELECT e."Titulo", ( sum(ea."Calificacion") / sum(et."Reactivos"))*10 as total FROM dbo."ExamenAlumno" ea JOIN dbo."ExamenTema" et ON et."IDTema" = ea."IDTema" JOIN dbo."Examen" e on e."IDExamen" = et."IDExamen" JOIN dbo."Bimestres" b on b."IDBimestre" = e."IDBimestre" where ea."IDAlumno" = ' + alumno + ' and b."Bimestre" = 4 and e."Titulo" IN (\'Parcial 1\',\'Parcial 2\',\'Bimestral 1\') GROUP BY e."Titulo" Union Distinct SELECT column_name as Nombre,h."Autoevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Autoevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,h."Coevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Coevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,(ad."PromedioTrabajo"/10) as Trabajos FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'AlumnoDesempenio\' AND column_name LIKE \'PromedioTrabajo\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1'),
                instrumentos5: instanceSequelize.query('select tp."Nombre",(sum(cast(pa."Aspecto1" as int)+cast(pa."Aspecto2" as int)+cast(pa."Aspecto3" as int)+cast(pa."Aspecto4" as int) +cast(pa."Aspecto5" as int))/ sum(pf."Reactivo1"+pf."Reactivo2"+pf."Reactivo3"+pf."Reactivo4"+pf."Reactivo5"))*10 as Total from dbo."Portafolio" pf JOIN dbo."PortafolioAlumno" pa ON pa."IDPortafolio" = pf."IDPortafolio" JOIN dbo."TipoPortafolio" tp ON tp."IDTipoPortafolio" = pf."IDTipoPortafolio" JOIN dbo."Bimestres" b ON b."IDBimestre" = pf."IDBimestre" where "IDAlumno" = ' + alumno + ' and b."Bimestre" = 5 group by tp."Nombre" Union Distinct SELECT e."Titulo", ( sum(ea."Calificacion") / sum(et."Reactivos"))*10 as total FROM dbo."ExamenAlumno" ea JOIN dbo."ExamenTema" et ON et."IDTema" = ea."IDTema" JOIN dbo."Examen" e on e."IDExamen" = et."IDExamen" JOIN dbo."Bimestres" b on b."IDBimestre" = e."IDBimestre" where ea."IDAlumno" = ' + alumno + ' and b."Bimestre" = 5 and e."Titulo" IN (\'Parcial 1\',\'Parcial 2\',\'Bimestral 1\') GROUP BY e."Titulo" Union Distinct SELECT column_name as Nombre,h."Autoevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Autoevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,h."Coevaluacion" FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'HabilidadesAlumno\' AND column_name LIKE \'Coevaluacion\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1 Union Distinct SELECT column_name as Nombre,(ad."PromedioTrabajo"/10) as Trabajos FROM dbo."AlumnoDesempenio" ad JOIN dbo."Alumno" al ON al."IDAlumno" = ad."IDAlumno" JOIN dbo."HabilidadesAlumno" h on h."IDAlumno" = ad."IDAlumno" CROSS JOIN (SELECT column_name FROM information_schema.columns WHERE table_schema = \'dbo\' AND table_name = \'AlumnoDesempenio\' AND column_name LIKE \'PromedioTrabajo\') cn where al."IDAlumno" = ' + alumno + ' and ad."Bimestre" = 1'),
            })
            .then((results) => {
                if (results.instrumentos1.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este alumno no tiene instrumentos"
                    })
                } else {
                    console.log('instrumentos1');
                    console.log(results.instrumentos1[0]);
                    instrumentos1 = results.instrumentos1[0];
                    instrumentos2 = results.instrumentos2[0];
                    instrumentos3 = results.instrumentos3[0];
                    instrumentos4 = results.instrumentos4[0];
                    instrumentos5 = results.instrumentos5[0];

                    if (instrumentos2.length < 1) {
                        instrumentos1.forEach((element) => {
                            let object = {};
                            object.Nombre = element.Nombre;
                            object.total = 0;
                            instrumentos2.push(object)
                        }, this);
                    }
                    if (instrumentos3.length < 1) {
                        instrumentos1.forEach((element) => {
                            let object = {};
                            object.Nombre = element.Nombre;
                            object.total = 0;
                            instrumentos3.push(object)
                        }, this);
                    }
                    if (instrumentos4.length < 1) {
                        instrumentos1.forEach((element) => {
                            let object = {};
                            object.Nombre = element.Nombre;
                            object.total = 0;
                            instrumentos4.push(object)
                        }, this);
                    }
                    if (instrumentos5.length < 1) {
                        instrumentos1.forEach((element) => {
                            let object = {};
                            object.Nombre = element.Nombre;
                            object.total = 0;
                            instrumentos5.push(object)
                        }, this);
                    }

                    const data = {
                        instrumentos1,
                        instrumentos2,
                        instrumentos3,
                        instrumentos4,
                        instrumentos5
                    }

                    res.json({
                        status: 1,
                        data
                    })
                }
            })
        }
    });
}

module.exports = {
    getControlInstrumentos,
    getControlInstrumentosBimestres
}