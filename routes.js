


    var express = require('express');
    const router = express.Router();    
    const auth = require('./helpers/auth.js');
    
    //Import Controllers    
    var generalCtrl = require('./controllers/generalController');
    var userCtrl = require('./controllers/userController');
    var grupoCtrl = require('./controllers/grupoController');
    var alumnoCtrl = require('./controllers/alumnoController');
    var bimestreCtrl = require('./controllers/bimestreController');
    var trabajoCtrl = require('./controllers/trabajoController');
    var trabajoAlumnoCtrl = require('./controllers/trabajoAlumnoController');
    var habilidadAlumnoCtrl = require('./controllers/habilidadAlumnoController');
    var examenCtrl = require('./controllers/examenController');
    var portafolioCtrl = require('./controllers/portafolioController');
    var controlCtrl = require('./controllers/controlController');

    
    router.route('/').get(generalCtrl.getHome); 

    //User controllers
    //router.route('/register').post(userCtrl.registerUser);
    //router.route('/login').post(userCtrl.authenticateUser);   
    router.post('/private', auth, generalCtrl.getPrivatePage);  

    router.route('/login').post(userCtrl.login);

    //Grupos
    router.get('/grupo', auth, grupoCtrl.getGrupo);
    router.get('/grupos', auth, grupoCtrl.getGrupos);
    router.get('/gruposarchivados', auth, grupoCtrl.getGruposArchivados);
    router.post('/nuevogrupo', auth, grupoCtrl.postGrupo);
    router.post('/clonargrupo', auth, grupoCtrl.cloneGrupo);
    router.put('/updategrupo', auth, grupoCtrl.updateGrupo);
    router.put('/updategrupostatus', auth, grupoCtrl.updateGrupoStatus);

    //Talleres
    router.get('/talleres', auth, grupoCtrl.getTalleres);
    router.post('/settaller', auth, grupoCtrl.postTaller);

    //Trabajos
    router.get('/trabajos', auth, trabajoCtrl.getTrabajos);
    router.post('/createtrabajo', auth, trabajoCtrl.postTrabajo);

    //Trabajos Alumnos
    router.get('/trabajosalumnos', auth, trabajoAlumnoCtrl.getTrabajosAlumno);
    router.post('/createtrabajo', auth, trabajoCtrl.postTrabajo);
    router.put('/updatetrabajoalumno', auth, trabajoAlumnoCtrl.estadoTrabajoAlumno);
    router.put('/changemultiplestatus', auth, trabajoCtrl.changeMultipleStatus);

    //Alumnos
    router.get('/alumnos', auth, alumnoCtrl.getAlumnos);
    router.get('/alumno', auth, alumnoCtrl.getAlumno);
    router.post('/setalumno', auth, alumnoCtrl.setAlumno);
    router.put('/updateAlumno', auth, alumnoCtrl.updateAlumno);
    router.delete('/deleteAlumno', auth, alumnoCtrl.deleteAlumno);
    router.get('/alumnoasistencia', auth, alumnoCtrl.getAlumnoAsistencia);
    

    //Examen
    router.get('/examenes', auth, examenCtrl.getExamenes);
    router.get('/examen', auth, examenCtrl.getExamen);
    router.post('/temaexamen', auth, examenCtrl.postTema);
    router.put('/updatetemaexamen', auth, examenCtrl.updateTemaCalificacion);


    //Bimestre
    router.get('/getAlumnosBimestre', auth, bimestreCtrl.getAlumnosBimestre);
    router.post('/createasistenciasesion', auth, bimestreCtrl.createAsistenciaSesion);
    router.get('/showAsistenciaAlumno', auth, bimestreCtrl.showAsistenciaAlumno);

    //Sesion
    router.put('/changeAsistenciaAlumno', auth, bimestreCtrl.changeAsistenciaAlumno);
    
    //Habilidades
    router.get('/habilidadalumno', auth, habilidadAlumnoCtrl.getHabilidadesAlumno);
    router.post('/crearhabilidadalumno', auth, habilidadAlumnoCtrl.postHabilidadesAlumno);
    router.put('/updatehabilidadalumno', auth, habilidadAlumnoCtrl.updateHabilidadesAlumno);

    //Instrumentos
    router.get('/instrumentosalumno', auth, portafolioCtrl.getInstrumentos);
    router.get('/instrumentoalumno', auth, portafolioCtrl.getInstrumento);
    router.put('/instrumentosalumno', auth, portafolioCtrl.updateCalificacionInstrumento);
    router.post('/aspectoinstrumento', auth, portafolioCtrl.agregarInstrumento);

    //Control
    router.get('/controlinstrumentos', auth, controlCtrl.getControlInstrumentos);
    router.get('/getcontrolinstrumentosbimestres', auth, controlCtrl.getControlInstrumentosBimestres);

    module.exports = router;    

router.get('/examenes', auth, examenCtrl.getExamen);



module.exports = router;	
