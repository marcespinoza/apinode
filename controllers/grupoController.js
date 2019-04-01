const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const Grupo = require('../models/grupo');
const env = require('simpledot');
const Bimestre = require('../models/bimestre');

// Status 0 borrado 1 normal y 2 archivado

module.exports["getGrupos"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            Grupo.findAll({where: {IDUsuario: data.userId.id, Status: 1, EsTaller: null}, attributes: ['Materia', 'Grupo', 'Grado', 'Escuela', 'RegistroFederalEscolar', 'Turno','Status','Color','Ciclo', 'IDUsuario', 'IDGrupo', 'EsTaller']}).then(group => {
                if (group.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene grupos.",
                        data: group
                    })
                } else {
                    const data = {
                        group: group
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

module.exports["getGruposArchivados"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            Grupo.findAll({where: {IDUsuario: data.userId.id, Status: 2, EsTaller: null}, attributes: ['Materia', 'Grupo', 'Grado', 'Escuela', 'RegistroFederalEscolar', 'Turno','Status','Color','Ciclo', 'IDUsuario', 'IDGrupo', 'EsTaller']}).then(group => {
                if (group.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene grupos.",
                        data: group
                    })
                } else {
                    const data = {
                        group: group
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

module.exports["getGrupo"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            Grupo.findAll({where: {IDGrupo: req.query.grupo}, attributes: ['Materia', 'Grupo', 'Grado', 'Escuela', 'RegistroFederalEscolar', 'Turno','Status','Color','Ciclo', 'IDUsuario', 'IDGrupo', 'EsTaller']}).then(group => {
                if (group.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este grupo no existe.",
                        data: group
                    })
                } else {
                    const data = {
                        group: group
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

module.exports["getTalleres"] = function(req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(req.token);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log(data);
            Grupo.findAll({where: {IDUsuario: data.userId.id, Status: 1, EsTaller: true}, attributes: ['Materia', 'Grupo', 'Grado', 'Escuela', 'RegistroFederalEscolar', 'Turno','Status','Color','Ciclo', 'IDUsuario', 'IDGrupo', 'EsTaller']}).then(group => {
                if (group.length == 0) {
                    res.json({
                        status: 1,
                        message: "Este usuario no tiene talleres."
                    })
                } else {
                    const data = {
                        group: group
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

// module.exports["postGrupo"] = function(req, res) {
//     jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
//         if(err) {
//             res.json({
//                 status: 0,
//                 message: "No tiene acceso a este recurso."
//             })
//         } else {
//             console.log(data);
//             const fields = {
//                 IDUsuario: data.userId.id,
//                 Materia: req.body.materia,
//                 Grado: req.body.grado,
//                 Grupo: req.body.grupo,
//                 Escuela: req.body.escuela,
//                 RegistroFederalEscolar: req.body.registroFederal,
//                 Turno: req.body.turno,
//                 Status: req.body.status,
//                 Color: req.body.color,
//                 Ciclo: req.body.ciclo
//             }

//             Grupo.create(fields).then((err, group) => {
//                 console.log(err)
//                 if (err) {
//                     res.json({
//                         status: 0,
//                         message: "Ha ocurrido un error"
//                     })
//                 } else {
//                     res.json({
//                         status: 1,
//                         message: "El grupo ha sido guardado"
//                     })
//                 }
//             });
//         }
//     });
// }

module.exports["postGrupo"] = function (req,res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(err);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            Grupo.create({ IDUsuario: data.userId.id, Materia: req.body.materia, Grado: req.body.grado, Grupo: req.body.grupo, Escuela: req.body.escuela, RegistroFederalEscolar: req.body.registroFederal, Turno: req.body.turno, Status: req.body.status, Color: req.body.color, Ciclo: req.body.ciclo}).then(grupo => {
                let bimestreArray = [];
                for (let bimestre = 1; bimestre < 6; bimestre++) {
                    let bimestreObject = {};
                    bimestreObject.IDGrupo = grupo.IDGrupo;
                    bimestreObject.Bimestre = bimestre;
                    bimestreArray.push(bimestreObject);
                }
                Bimestre.bulkCreate(bimestreArray).then(bimestresInsert => {
                    const data = {
                        grupo
                    }
                    res.json({
                        status: 1,
                        message: "El grupo ha sido creado",
                        data
                    })
                }).catch(err => {
                    res.json({
                        status: 0,
                        message: "Ha ocurrido un error"
                    })
                })
              }).catch(err => {
                    res.json({
                        status: 0,
                        message: "Ha ocurrido un error"
                    })
              })

        }
    });  
}

module.exports["updateGrupo"] = function (req,res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(err);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            Grupo.update({ Materia: req.body.materia, Grado: req.body.grado, Grupo: req.body.grupo, Escuela: req.body.escuela, RegistroFederalEscolar: req.body.registroFederal, Turno: req.body.turno, Color: req.body.color, Ciclo: req.body.ciclo}, {where: {IDGrupo: req.body.grupoId}}).then((result) => {
                res.json({
                    status: 1,
                    message: "El grupo ha sido actualizado"
                });
            }).catch(function (err) {
                res.json({
                    status: 0,
                    message: "No se ha podido actualizar"
                });
            });

        }
        
    });  
}

module.exports["updateGrupoStatus"] = function (req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(err);
        if (err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            Grupo.update({ Status: req.body.status }, { where: { IDGrupo: req.body.grupoId } }).then((result) => {
                res.json({
                    status: 1,
                    message: "El grupo ha sido actualizado"
                });
            }).catch(function (err) {
                res.json({
                    status: 0,
                    message: "No se ha podido actualizar"
                });
            });

        }

    });
}

module.exports["cloneGrupo"] = function (req, res) {
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(err);
        if (err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            console.log("grupo",req.body.grupo);
            Grupo.findOne({ where: { IDGrupo: req.body.grupo } }).then((foundgrupo) => {
                const grupo = foundgrupo.dataValues;
                let arrayBimestre = []
                Grupo.create({ IDUsuario: grupo.IDUsuario, Materia: grupo.Materia, Grado: grupo.Grado, Grupo: grupo.Grupo, Escuela: grupo.Escuela, RegistroFederalEscolar: grupo.RegistroFederalEscolar, Turno: grupo.Turno, Status: grupo.Status, Color: grupo.Color, Ciclo: grupo.Ciclo }).then((result) => {
                    console.log(result.dataValues);
                    const newgroup = result.dataValues;
                    for (let index = 1; index < 6; index++) {
                        arrayBimestre.push({ Bimestre: index, IDGrupo: newgroup.IDGrupo });
                    }
                    Bimestre.bulkCreate(arrayBimestre)
                        .then(function (response) {
                            res.json({
                                status: 1,
                                message: "El grupo ha sido clonado",
                                grupo: result,
                                bimestre: response
                            });
                        }).catch(function (err) {
                            console.log("bimestre", err);
                            res.json({
                                status: 0,
                                message: "No se ha podido clonar"
                            });
                        });
                }).catch(function (err) {
                    console.log("grupo", err);
                    res.json({
                        status: 0,
                        message: "No se ha podido clonar"
                    });
                });
            });
        }
    });
}

module.exports["postTaller"] = function (req,res){
    jwt.verify(req.token, env.SECRET_HASH, function (err, data) {
        console.log(err);
        if(err) {
            res.json({
                status: 0,
                message: "No tiene acceso a este recurso."
            })
        } else {
            Grupo.create({ IDUsuario: data.userId.id, Materia: req.body.materia, Grado: req.body.grado, Grupo: req.body.grupo, Escuela: req.body.escuela, RegistroFederalEscolar: req.body.registroFederal, Turno: req.body.turno, Status: req.body.status, Color: req.body.color, Ciclo: req.body.ciclo, EsTaller: true}).then(taller => {
                // let's assume the default of isAdmin is false:
                console.log(taller.get({
                  plain: true
                })) 
                res.json({
                    status: 1,
                    message: "El taller ha sido creado"
                })
              })

        }
    });  
}