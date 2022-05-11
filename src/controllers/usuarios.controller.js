const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { table } = require('table');
const md_autenticacion = require('../middlewares/autenticacion');

//Login
function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
                if (verificacionPassword) {
                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }
                } else {
                    return res.status(500).send({ mensaje: 'la pasword no coincide' })
                }
            })

        } else {
            return res.status(500).send({ mensaje: "Error, usuario no se encuentra registrado" })
        }
    })
}
//Agregar
function UsuarioInicial() {
    var usuariosModels = new Usuarios();

    usuariosModels.nombre = 'Administrador';
    usuariosModels.usuario = 'ADMIN';
    usuariosModels.rol = 'Rol_Admin';

    Usuarios.find((err, usuarioEncontrado) => {
        if (usuarioEncontrado.length == 0) {

            bcrypt.hash('deportes123', null, null, (err, paswordEncriptada) => {
                usuariosModels.password = paswordEncriptada;
            });
            usuariosModels.save()
        }
    })
}

function Registo(req, res) {
    var parametros = req.body;
    var usuariosModels = new Usuarios();

    if (parametros.nombre, parametros.usuario, parametros.password) {
        usuariosModels.nombre = parametros.nombre;
        usuariosModels.usuario = parametros.usuario;
        usuariosModels.rol = "Rol_User";

        Usuarios.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuariosModels.password = passwordEncriptada;
                });
                usuariosModels.save((err, usuarioGuardado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!usuarioGuardado) return res.status(400).send({ mensaje: "Error al agregar el usuario" });
                    return res.status(200).send({ usuario: usuarioGuardado });
                })
            } else {
                return res.status(500).send({ mensaje: 'Este usuario ya se encuentra utilizado' })
            }
        })
    }
}

function agregarUsuario(req, res) {
    var parametros = req.body;
    var usuariosModels = new Usuarios();

    if (req.user.rol == 'Rol_Admin') {
        if (parametros.nombre, parametros.usuario, parametros.password, parametros.rol) {
            usuariosModels.nombre = parametros.nombre;
            usuariosModels.usuario = parametros.usuario;
            usuariosModels.rol = parametros.rol;

            Usuarios.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
                if (usuarioEncontrado.length == 0) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuariosModels.password = passwordEncriptada;
                    });
                    usuariosModels.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!usuarioGuardado) return res.status(400).send({ mensaje: "Error al agregar el usuario" });
                        return res.status(200).send({ usuario: usuarioGuardado });
                    })
                } else {
                    return res.status(500).send({ mensaje: 'Este usuario ya se encuentra utilizado' })
                }
            })
        }
    } else {
        return res.status(500).send({ mensaje: "No esta Autorizado para crear un Usuario" });
    }
}

//Editar
function EditarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    if (req.user.rol == 'Rol_Admin' || idUser === req.user.sub) {
        Usuarios.findById(idUser, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.rol == 'Rol_User' && req.user.sub === idUser) {
                parametros.rol = 'Rol_User';
                Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEditado) return res.status(404).send({ mensaje: 'Error al Editar el usuario' })
                    return res.status(200).send({ usuario: usuarioEditado });
                })
            } else if (usuarioEncontrado.rol == 'Rol_User' && req.user.rol == 'Rol_Admin') {
                Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEditado) return res.status(404).send({ mensaje: 'Error al Editar el usuario' })
                    return res.status(200).send({ usuario: usuarioEditado });
                })
            } else {
                return res.status(500).send({ mensaje: 'no esta autorizado para editar' });
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'no esta autorizado para editar' });
    }
}

//Eliminar
function EliminarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    if (idUser === req.user.sub || req.user.rol == 'Rol_Admin') {
        Usuarios.findById(idUser, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.rol == 'Rol_User' && req.user.sub === idUser) {
                Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Error al Eliminar el usuario' })
                    return res.status(200).send({ Usuario: usuarioEliminado });
                })
            } else if (usuarioEncontrado.rol == 'Rol_User' && req.user.rol == 'Rol_Admin') {
                Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Error al Eliminar el usuario' })
                    return res.status(200).send({ Usuario: usuarioEliminado });
                })
            } else {
                return res.status(500).send({ mensaje: 'no esta autorizado para Eliminar' });
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado para eliminar' });
    }
}
//ver
function verUsuarios(req, res) {
    if (req.user.rol == 'Rol_Admin') {
        Usuarios.find((err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuariosEncontrados) return res.status(404).send({ mensaje: 'Error al cargar los usuarios' });

            return res.status(200).send({ usuarios: usuariosEncontrados });
        })
    }
}

function verUsuarioPorNombre(req, res) {
    var parametros = req.body;
    if (req.user.rol == 'Rol_Admin') {
        Usuarios.find({ nombre: parametros.nombre }, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioEncontrado) return res.status(404).send({ mensaje: 'Error al encontrar el usuario' });

            return res.status(200).send({ usuario: usuarioEncontrado });
        })
    }
}

function verUsurioPorId(req, res) {
    var idUser = req.params.idUsuario;
    if (req.user.rol == 'Rol_Admin') {
        Usuarios.findById(idUser, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioEncontrado) return res.status(404).send({ mensaje: 'Error al encontrar el usuario' });

            return res.status(200).send({ usuario: usuarioEncontrado });
        })
    }
}

//Exports
module.exports = {
    Login,
    UsuarioInicial,
    Registo,
    agregarUsuario,
    EditarUsuario,
    EliminarUsuario,
    verUsuarios,
    verUsuarioPorNombre,
    verUsurioPorId
}