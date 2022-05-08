const Equipos = require('../models/equipos.model');
const Ligas = require('../models/ligas.model');

//agregar
function agregarEquipo(req, res) {
    var parametros = req.body.parametros;
    var equipoModel = new Equipos();

    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        if (parametros.equipo && parametros.liga) {
            Ligas.find({ liga: parametros.liga, idUser: req.user.sub }, (err, ligaEncontrada) => {
                if (!ligaEncontrada) return res.status(404).send({ mensaje: 'No se encontro la liga' });
                Equipos.find({ equipo: parametros.equipo, idLiga: ligaEncontrada[0]._id }, (err, equipoEncontrado) => {
                    if (equipoEncontrado.lenght == 0) {
                        equipoModel.puntos = 0;
                        equipoModel.golesFavor = 0;
                        equipoModel.golesContra = 0;
                        equipoModel.diferenciaGoles = 0;
                        equipoModel.partidosJugados = 0;
                        equipoModel.equipo = parametros.equipo;
                        equipoModel.idLIga = ligaEncontrada[0]._id;
                        equipoModel.save((err, equipoGuardado)=>{
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!equipoGuardado) return res.status(400).send({ mensaje: "Error al agregar el producto" });
                            return res.status(200).send({ equipo: equipoGuardado });
                        })
                    } else {
                        return res.status(404).send({ mensaje: 'Este equipo ya se encuentra requistrado' })
                    }
                })
            })
        } else {
            return res.status(404).send({ message: 'Rellene todos los campos' })
        }
    } else {
        return res.status(404).send({ message: 'No esta Autorizado' });
    }
}

function agregarEquipoAdmin(req, res) {
    idUser = idUsuario;
    var parametros = req.body.parametros;
    var equipoModel = new Equipos();

    if (req.user.rol == 'Rol_Admin') {
        if (parametros.equipo && parametros.liga) {
            Ligas.find({ liga: parametros.liga, idUser: idUser }, (err, ligaEncontrada) => {
                if (!ligaEncontrada) return res.status(404).send({ mensaje: 'No se encontro la liga' });
                Equipos.find({ equipo: parametros.equipo, idLiga: ligaEncontrada[0]._id }, (err, equipoEncontrado) => {
                    if (equipoEncontrado.lenght == 0) {
                        equipoModel.puntos = 0;
                        equipoModel.golesFavor = 0;
                        equipoModel.golesContra = 0;
                        equipoModel.diferenciaGoles = 0;
                        equipoModel.partidosJugados = 0;
                        equipoModel.equipo = parametros.equipo;
                        equipoModel.idLIga = ligaEncontrada[0]._id;
                        equipoModel.save((err, equipoGuardado)=>{
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!equipoGuardado) return res.status(400).send({ mensaje: "Error al agregar el producto" });
                            return res.status(200).send({ equipo: equipoGuardado });
                        })
                    } else {
                        return res.status(404).send({ mensaje: 'Este equipo ya se encuentra requistrado' })
                    }
                })
            })
        } else {
            return res.status(404).send({ message: 'Rellene todos los campos' })
        }
    } else {
        return res.status(404).send({ message: 'No esta Autorizado' });
    }
}
//editar
function editarEquipo(req, res){
    var idEquipo = req.params.idEquipo;
    var parametros = req.body.parametros;
    if(req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User'){
        if(parametros.puntos || parametros.golesFavor || parametros.golesContra || parametros.diferenciaGoles || parametros.partidosJugados)
        return res.status(404).send({mensaje: 'No se pueden editar los campos'});
        if(parametros.equipo || parametros.liga){
            Ligas.find({ liga: parametros.liga, idUser: req.user.sub }, (err, ligaEncontrada) => {
                if (!ligaEncontrada) return res.status(404).send({ mensaje: 'No se encontro la liga' });
                Equipos.find({ equipo: parametros.equipo, idLiga: ligaEncontrada[0]._id }, (err, equipoEncontrado) => {
                    if (equipoEncontrado.lenght == 0) {
                    } else {
                        return res.status(404).send({ mensaje: 'Este equipo ya se encuentra requistrado' })
                    }
                })
            })
        }else{
            return res.status(404).send({mensaje: 'Rellene todos los campos'})
        }
    }
}

//eliminar