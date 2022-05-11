const express = require('express');
const ligasController = require('../controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

api.post('/agregarLiga',md_autenticacion.Auth,ligasController.agregarLiga);
api.post('/agregarLigaAdmin/:idUsuario',md_autenticacion.Auth,ligasController.agregarLigaAdmin);
api.put('/editarLiga/:idLiga',md_autenticacion.Auth,ligasController.editarLiga);
api.delete('/eliminarLiga/:idLiga',md_autenticacion.Auth,ligasController.eliminarLiga);

module.exports = api;