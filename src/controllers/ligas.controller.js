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
                        if (ligaEncontrada2.idUser != req.user.sub) return res.status(500).send({ mensaje: 'No puede editar ligas de otros' });
                        Ligas.findByIdAndUpdate(idLiga, parametros, { new: true }, (err, ligaActualizada) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!ligaActualizada) return res.status(400).send({ mensaje: "Error al editar la liga" });
                            return res.status(200).send({ liga: ligaActualizada });
                        })
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
        Ligas.findById(idLiga, (err, ligaEncontrada2) => {
            if (ligaEncontrada2.idUser != req.user.sub) return res.status(500).send({ mensaje: 'No puede editar ligas de otros' });
            Ligas.findByIdAndUpdate(idLiga, parametros, { new: true }, (err, ligaActualizada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!ligaActualizada) return res.status(400).send({ mensaje: "Error al editar la liga" });
                return res.status(200).send({ liga: ligaActualizada });
            })
        })
    } else {
        return res.status(404).send({ mensaje: 'No esta autorizado para agregar ligas' })
    }
}

//ver