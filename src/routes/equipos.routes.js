const express = require('express');
const equiposControler = require('../controllers/equipos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

api.post('/agregarEquipo',md_autenticacion.Auth,equiposControler.agregarEquipo);
api.post('/agregarEquipoAdmin/:idUsuario',md_autenticacion.Auth,equiposControler.agregarEquipoAdmin);
api.put('/editarEquipo/:idEquipo',md_autenticacion.Auth,equiposControler.editarEquipo);
api.delete('/eliminarEquipo/:idEquipo',md_autenticacion.Auth,equiposControler.eliminarEquipo);
api.get('/verEquiposLiga/:idLiga',md_autenticacion.Auth,equiposControler.verEquiposLiga);
api.get('/verTabla/:idLiga',md_autenticacion.Auth,equiposControler.verTabla);

module.exports = api;