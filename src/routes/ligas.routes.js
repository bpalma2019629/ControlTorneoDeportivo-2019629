const express = require('express');
const ligasController = require('../controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

api.post('/agregarLiga',md_autenticacion.Auth,ligasController.agregarLiga);
api.post('/agregarLigaAdmin/:idUsuario',md_autenticacion.Auth,ligasController.agregarLigaAdmin);
api.put('/editarLiga/:idLiga',md_autenticacion.Auth,ligasController.editarLiga);
api.delete('/eliminarLiga/:idLiga',md_autenticacion.Auth,ligasController.eliminarLiga);
//api.get('/verUsuarios',md_autenticacion.Auth,usuariosController.verUsuarios);
//api.get('/verUsuarioPorNombre',md_autenticacion.Auth,usuariosController.verUsuarioPorNombre);
//api.get('/verUsuarioPorId/:idUsuario',md_autenticacion.Auth,usuariosController.verUsurioPorId)

module.exports = api;