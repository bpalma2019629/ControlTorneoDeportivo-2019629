const Ligas = require('../models/ligas.model');


// agregar 

function agregarLiga(req, res) {
    var parametros = req.body;
    var ligasModel = new Ligas();
    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        if (parametros.liga) {
            Ligas.find({ liga: parametros.liga, idUser: req.user.sub }, (err, ligaEncontrada) => {
                if (ligaEncontrada.length == 0) {
                    ligasModel.liga = parametros.liga;
                    ligasModel.idUser = req.user.sub;
                    ligasModel.save((err, ligaGuardada) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!ligaGuardada) return res.status(400).send({ mensaje: "Error al agregar la liga" });
                        return res.status(200).send({ liga: ligaGuardada });
                    });
                } else {
                    return res.status(404).send({ mensaje: 'Esta liga ya se encuentra Creada' })
                }
            })
        } else {
            return res.status(404).send({ mensaje: 'ingrese el nombre de la liga' })
        }
    } else {
        return res.status(404).send({ mensaje: 'No esta autorizado para agregar ligas' })
    }
}

function agregarLigaAdmin(req, res){
    var idUser = req.params.idUsuario;
    var parametros = req.body.parametros;
    var ligasModel = new Ligas();
    if(req.user.rol == 'Rol_Admin'){
        if(parametros.liga){
            Ligas.find({liga:parametros.liga, idUser:idUser}, (err, ligaEncontrada)=>{
                if(ligaEncontrada.length = 0){
                    ligasModedl.liga = parametros.liga;
                    ligasModel.idUser = idUser;
                    ligasModel.save((err, ligaGuardada)=>{
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!ligaGuardada) return res.status(400).send({ mensaje: "Error al agregar la liga" });
                        return res.status(200).send({ liga: ligaGuardada });
                    })
                }
            })
        } else {
            return res.status(404).send({ mensaje: 'ingrese el nombre de la liga' })
        }
    }else{
        return res.status(404).send({ mensaje: 'No esta autorizado para agregar'})
    }
}

// editar 

function editarLiga(req, res) {
    var idLiga = req.params.idLiga;
    var parametros = req.body;
    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        if (parametros.liga) {
            if (parametros.idUser) return res.status(404).send({ mensaje: 'No se puede editar el id' });
            Ligas.find({ liga: parametros.liga, idUser: req.user.sub }, (err, ligaEncontrada) => {
                if (ligaEncontrada.length == 0) {
                    Ligas.findById(idLiga, (err, ligaEncontrada2) => {
                        if (ligaEncontrada2.idUser == req.user.sub || req.user.rol == 'Rol_Admin'){
                            Ligas.findByIdAndUpdate(idLiga, parametros, { new: true }, (err, ligaActualizada) => {
                                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                if (!ligaActualizada) return res.status(400).send({ mensaje: "Error al editar la liga" });
                                return res.status(200).send({ liga: ligaActualizada });
                            })
                        }else{
                            return res.status(500).send({ mensaje: 'No puede editar ligas de otros' });
                        }
                    })
                } else {
                    return res.status(404).send({ mensaje: 'No se puede crear la Liga' })
                }
            })
        } else {
            return res.status(404).send({ mensaje: 'ingrese el nombre de la liga' })
        }
    } else {
        return res.status(404).send({ mensaje: 'No esta autorizado para agregar ligas' })
    }

}

// eliminar
function eliminarLiga(req, res) {
    var idLiga = req.params.idLiga;
    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        Ligas.findById(idLiga, (err, ligaEncontrada) => {
            if (ligaEncontrada.idUser == req.user.sub || req.user.rol == 'Rol_Admin'){
                Ligas.findByIdAndDelete(idLiga, (err, ligaEliminada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!ligaEliminada) return res.status(400).send({ mensaje: "Error al editar la liga" });
                    return res.status(200).send({ liga: ligaEliminada });
                })
            }else{
                return res.status(500).send({ mensaje: 'No puede editar ligas de otros' });
            }
        })
    } else {
        return res.status(404).send({ mensaje: 'No esta autorizado para agregar ligas' })
    }
}

//ver

//exports
module.exports ={
    agregarLiga,
    agregarLigaAdmin,
    editarLiga,
    eliminarLiga
}