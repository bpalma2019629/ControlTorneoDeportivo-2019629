const express = require('express');
const partidosController = require('../controllers/partidos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

api.put('/partido/:idLiga',md_autenticacion.Auth,partidosController.partido);


module.exports = api;