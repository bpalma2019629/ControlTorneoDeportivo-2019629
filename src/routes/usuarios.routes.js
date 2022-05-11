const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

api.post('/login', usuariosController.Login);
api.post('/registrar', usuariosController.Registo);
api.post('/agregarUsuario',md_autenticacion.Auth,usuariosController.agregarUsuario);
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth,usuariosController.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth,usuariosController.EliminarUsuario);
api.get('/verUsuarios',md_autenticacion.Auth,usuariosController.verUsuarios);
api.get('/verUsuarioPorNombre',md_autenticacion.Auth,usuariosController.verUsuarioPorNombre);
api.get('/verUsuarioPorId/:idUsuario',md_autenticacion.Auth,usuariosController.verUsurioPorId)

module.exports = api;