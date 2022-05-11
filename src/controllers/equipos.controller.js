const Equipos = require('../models/equipos.model');
const Ligas = require('../models/ligas.model');
const PDF = require('pdfkit-construct');
const fs = require('fs');

//agregar
function agregarEquipo(req, res) {
    var parametros = req.body;
    var equipoModel = new Equipos();

    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        if (parametros.equipo && parametros.liga) {
            Ligas.findOne({ liga: parametros.liga, idUser: req.user.sub }, (err, ligaEncontrada) => {
                if (!ligaEncontrada) return res.status(404).send({ mensaje: 'No se encontro la liga' });
                Equipos.find({ liga: ligaEncontrada._id }, (err, equiposLiga) => {
                    if (equiposLiga.lenght >= 10) return res.status(404).send({ mensaje: 'La liga solo puede tener 10 equipos maximo' });
                    Equipos.find({ equipo: parametros.equipo, liga: ligaEncontrada._id }, (err, equipoEncontrado) => {
                        if (equipoEncontrado.length == 0) {
                            equipoModel.puntos = 0;
                            equipoModel.golesFavor = 0;
                            equipoModel.golesContra = 0;
                            equipoModel.diferenciaGoles = 0;
                            equipoModel.partidosJugados = 0;
                            equipoModel.equipo = parametros.equipo;
                            equipoModel.liga = ligaEncontrada._id;
                            equipoModel.save((err, equipoGuardado) => {
                                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                if (!equipoGuardado) return res.status(400).send({ mensaje: "Error al agregar el equipo" });
                                return res.status(200).send({ equipo: equipoGuardado });
                            })
                        } else {
                            return res.status(404).send({ mensaje: 'Este equipo ya se encuentra registrado' })
                        }
                    })
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
    idUser = req.params.idUsuario;
    var parametros = req.body;
    var equipoModel = new Equipos();

    if (req.user.rol == 'Rol_Admin') {
        if (parametros.equipo && parametros.liga) {
            Ligas.findOne({ liga: parametros.liga, idUser: idUser }, (err, ligaEncontrada) => {
                if (!ligaEncontrada) return res.status(404).send({ mensaje: 'No se encontro la liga' });
                Equipos.find({ liga: ligaEncontrada._id }, (err, equiposLiga) => {
                    if (equiposLiga.lenght >= 10) return res.status(404).send({ mensaje: 'La liga solo puede tener 10 equipos maximo' });
                    Equipos.findOne({ equipo: parametros.equipo, liga: ligaEncontrada._id }, (err, equipoEncontrado) => {
                        if (!equipoEncontrado) {
                            equipoModel.puntos = 0;
                            equipoModel.golesFavor = 0;
                            equipoModel.golesContra = 0;
                            equipoModel.diferenciaGoles = 0;
                            equipoModel.partidosJugados = 0;
                            equipoModel.equipo = parametros.equipo;
                            equipoModel.liga = ligaEncontrada._id;
                            equipoModel.save((err, equipoGuardado) => {
                                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                if (!equipoGuardado) return res.status(400).send({ mensaje: "Error al agregar el equipo" });
                                return res.status(200).send({ equipo: equipoGuardado });
                            })
                        } else {
                            return res.status(404).send({ mensaje: 'Este equipo ya se encuentra requistrado' })
                        }
                    })
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
function editarEquipo(req, res) {
    var idEquipo = req.params.idEquipo;
    var parametros = req.body;
    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        if (parametros.puntos || parametros.golesFavor || parametros.golesContra || parametros.diferenciaGoles || parametros.partidosJugados)
            return res.status(404).send({ mensaje: 'No se pueden editar los campos' });
        if (parametros.equipo || parametros.liga) {
            Equipos.findById(idEquipo, (err, infoEquipo) => {
                if (!infoEquipo) return res.status(404).send({ mensaje: 'No se encontro el equipo' });
                Ligas.findById(infoEquipo.liga, (err, infoLiga) => {
                    if (!infoLiga) return res.status(404).send({ mensaje: 'No se encontro la ligas' });
                    if (req.user.sub === 'Rol_Admin' || req.user.sub == infoLiga.idUser) {
                        if (parametros.liga) {
                            Ligas.findOne({ liga: parametros.liga, idUser: infoLiga._id }, (err, ligaEncontrada) => {
                                if (!ligaEncontrada) return res.status(404).send({ mensaje: 'No se encontro la liga' });
                                parametros.liga = ligaEncontrada._id;
                                Equipos.findOne({ equipo: parametros.equipo, liga: ligaEncontrada._id }, (err, equipoEncontrado) => {
                                    if (!equipoEncontrado) {
                                        Equipos.findByIdAndUpdate(idEquipo, parametros, { new: true }, (err, equpoActualizado) => {
                                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                            if (!equpoActualizado) return res.status(400).send({ mensaje: "Error al editar el equipo" });
                                            return res.status(200).send({ equipo: equpoActualizado });
                                        })
                                    } else {
                                        return res.status(404).send({ mensaje: 'Este equipo ya se encuentra requistrado' })
                                    }
                                })
                            })
                        } else {
                            Equipos.findOne({ equipo: parametros.equipo, liga: infoLiga._id }, (err, equipoEncontrado) => {
                                if (!equipoEncontrado) {
                                    Equipos.findByIdAndUpdate(idEquipo, parametros, { new: true }, (err, equpoActualizado) => {
                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                        if (!equpoActualizado) return res.status(400).send({ mensaje: "Error al editar el equipo" });
                                        return res.status(200).send({ equipo: equpoActualizado });
                                    })
                                } else {
                                    return res.status(404).send({ mensaje: 'Este equipo ya se encuentra requistrado' })
                                }
                            })
                        }
                    } else {
                        return res.status(404).send({ mensaje: 'No se pueden editar Equipos de otro usuario' })
                    }
                })
            })
        } else {
            return res.status(404).send({ mensaje: 'Rellene todos los campos' })
        }
    }
}

//eliminar
function eliminarEquipo(req, res) {
    var idEquipo = req.params.idEquipo;
    var parametros = req.body;
    if (req.user.rol == 'Rol_Admin' || req.user.rol == 'Rol_User') {
        Equipos.findById(idEquipo, (err, infoEquipo) => {
            if (!infoEquipo) return res.status(404).send({ mensaje: 'No se encontro el equipo' });
            Ligas.findById(infoEquipo.liga, (err, infoLiga) => {
                if (!infoLiga) return res.status(404).send({ mensaje: 'No se encontro la ligas' });
                if (req.user.sub === 'Rol_Admin' || req.user.sub == infoLiga.idUser) {
                    Equipos.findByIdAndDelete(idEquipo, (err, equipoEliminado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!equipoEliminado) return res.status(400).send({ mensaje: "Error al eliminar el equipo" });
                        return res.status(200).send({ equipo: equipoEliminado });
                    })
                } else {
                    return res.status(404).send({ mensaje: 'No se pueden eliminar Equipos de otro usuario' })
                }
            })
        })

    }
}

function verEquiposLiga(req, res) {
    var idLiga = req.params.idLiga;

    Ligas.findById(idLiga, (err, infoLiga) => {
        if (req.user.rol == 'Rol_Admin' || infoLiga.idUser == req.user.sub) {
            Equipos.find({ liga: idLiga }, (err, equiposEncontrados) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!equiposEncontrados) return res.status(400).send({ mensaje: "Error al encontrar los equipo" });
                return res.status(200).send({ equipos: equiposEncontrados });
            }).select('equipo')
        } else {
            return res.status(404).send({ mensaje: 'No esta Autorizado' })
        }
    })
}

function verTabla(req, res) {
    var idLiga = req.params.idLiga;

    Ligas.findById(idLiga, (err, infoLiga) => {
        if (req.user.rol == 'Rol_Admin' || infoLiga.idUser == req.user.sub) {
            Equipos.find({ liga: idLiga }, (err, equiposEncontrados) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!equiposEncontrados) return res.status(400).send({ mensaje: "Error al encontrar los equipo" });
                obtenerPDF(infoLiga, equiposEncontrados);
                return res.status(200).send({ equipos: equiposEncontrados });
            }).sort({ puntos: -1 })
        } else {
            return res.status(404).send({ mensaje: 'No esta Autorizado' })
        }
    })
}

function obtenerPDF(infoLiga, equiposEncontrados ) {
    var f = new Date();
    var Fecha = f.getDate() + "-" + f.getMonth() + "-" + f.getFullYear();
    var Hora = f.getHours() + '-' + f.getMinutes() + '-' + f.getSeconds();
    var doc = new PDF({
        size: 'A4',
        margins: { top: 120, left: 10, right: 10, bottom: 20 },
        bufferPages: true,
    });

    const registros = equiposEncontrados.map((equipo)=>{
        const registro = {
            equipo: equipo.equipo,
            PJ: equipo.partidosJugados,
            GF: equipo.golesFavor,
            GC: equipo.golesContra,
            DG: equipo.diferenciaGoles,
            Pts: equipo.puntos
        }
        return registro;
    })



    doc.setDocumentHeader({}, () => {

        doc.lineJoin('miter')
            .rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill("#082183");

        doc.fill("#FFFFFF")
            .fontSize(20)
            .text(infoLiga.liga, doc.header.x, doc.header.y - 93);
    });

    doc.setDocumentFooter({}, () => {

        doc.lineJoin('miter')
            .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill("#4D6DEC");

        doc.fill("#FFFFFF")
            .fontSize(15)
            .text(Hora, doc.footer.x + 280, doc.footer.y + 3);
    });

    doc.addTable(
        [
            {key: 'equipo', label: 'Equipo', align: 'left'},
            {key: 'PJ', label: 'PJ', align: 'left'},
            {key: 'GF', label: 'GF', align: 'right'},
            {key: 'GC', label: 'GC',align: 'right'},
            {key: 'DG', label: 'DG', align: 'right'},
            {key: 'Pts', label: 'Pts', align: 'right'}
        ],
        registros, {
            border: null,
            width: "fill_body",
            striped: true,
            stripedColors: ["#AEE8FF", "#07B4F9"],
            cellsPadding: 10,
            marginLeft: 45,
            marginRight: 45,
            headAlign: 'center'
        });

    doc.render();

    doc.pipe(fs.createWriteStream(infoLiga.liga + '-' + Fecha + '-' + Hora + '.pdf'));
    doc.end();
}

//Exports
module.exports = {
    agregarEquipo,
    agregarEquipoAdmin,
    editarEquipo,
    eliminarEquipo,
    verEquiposLiga,
    verTabla
}