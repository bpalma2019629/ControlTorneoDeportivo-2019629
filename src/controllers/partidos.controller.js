const Equipos = require('../models/equipos.model');
const Ligas = require('../models/ligas.model');
const Partidos = require('../models/partidos.model');

function partido(req, res) {
    var idLiga = req.params.idLiga;
    var partidoModel = new Partidos();
    var parametros = req.body;
    var jornadas = 0;
    var partidos = 0;
    var ganador = 3;
    var empate = 1;
    var perdedor = 0;
    if (parametros.equipo1 && parametros.equipo2 && parametros.golesEquipo1 && parametros.golesEquipo2 && parametros.jornada) {
        if (parametros.equipo1 == parametros.equipo2) return res.status(404).send({ mensaje: 'No se puede ingresar el equipo 2 veces' });
        Ligas.findById(idLiga, (err, infoLiga) => {
            if (req.user.rol == 'Rol_Admin' || infoLiga.idUser == req.user.sub) {
                Equipos.find({ liga: idLiga }, (err, equiposLiga) => {
                    if (!equiposLiga) return res.status(404).send({ mensaje: 'Error al obtener los equipos' });
                    if (equiposLiga.length % 2 == 0) {
                        jornadas = equiposLiga.length - 1;
                        partidos = equiposLiga.length / 2;
                    } else {
                        jornadas = equiposLiga.length;
                        partidos = (equiposLiga.length - 1) / 2;
                    }
                    if (parametros.jornada > jornadas || parametros.jornada <= 0) return res.status(404).send({ mensaje: 'La jornada excede las disponibles' });
                    Partidos.find({ jornada: parametros.jornada, idLiga: idLiga }, (err, partidosEncontrados) => {
                        if (partidosEncontrados.length < partidos) {
                            Partidos.findOne({ equipo1: parametros.equipo1, jornada: parametros.jornada, idLiga: idLiga }, (err, equipo1Participado) => {
                                if (equipo1Participado) res.status(404).send({ mensaje: 'El equipo ya jugo en la jornada' });
                                Partidos.findOne({ equipo2: parametros.equipo1, jornada: parametros.jornada, idLiga: idLiga }, (err, equipo1Participado2) => {
                                    if (equipo1Participado2) res.status(404).send({ mensaje: 'El equipo ya jugo en la jornada' });
                                    Partidos.findOne({ equipo1: parametros.equipo2, jornada: parametros.jornada, idLiga: idLiga }, (err, equipo2Participado) => {
                                        if (equipo2Participado) res.status(404).send({ mensaje: 'El equipo ya jugo en la jornada' });
                                        Partidos.findOne({ equipo2: parametros.equipo2, jornada: parametros.jornada, idLiga: idLiga }, (err, equipo2Participado2) => {
                                            if (equipo2Participado2) res.status(404).send({ mensaje: 'El equipo ya jugo en la jornada' });
                                            partidoModel.equipo1 = parametros.equipo1;
                                            partidoModel.equipo2 = parametros.equipo2;
                                            partidoModel.golesEquipo1 = parametros.golesEquipo1;
                                            partidoModel.golesEquipo2 = parametros.golesEquipo2;
                                            partidoModel.jornada = parametros.jornada;
                                            partidoModel.idLiga = idLiga;
                                            partidoModel.save((err, partidoGuardado) => {
                                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                                if (!partidoGuardado) return res.status(404).send({ mensaje: 'No se pudo guardar el parido' });
                                                if (parametros.golesEquipo1 > parametros.golesEquipo2) {
                                                    Equipos.findOneAndUpdate({ equipo: parametros.equipo1, liga: idLiga }, { $inc: { golesFavor: parametros.golesEquipo1, golesContra: parametros.golesEquipo2, puntos: ganador, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
                                                        Equipos.findOneAndUpdate({ equipo: parametros.equipo1, liga: idLiga }, { diferenciaGoles: Number(equipoActualizado.golesFavor) - Number(equipoActualizado.golesContra) }, { new: true }, (err, diferencia) => {
                                                            Equipos.findOneAndUpdate({ equipo: parametros.equipo2, liga: idLiga }, { $inc: { golesFavor: parametros.golesEquipo2, golesContra: parametros.golesEquipo1, puntos: perdedor, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
                                                                Equipos.findOneAndUpdate({ equipo: parametros.equipo2, liga: idLiga }, { diferenciaGoles: Number(equipoActualizado.golesFavor) - Number(equipoActualizado.golesContra) }, { new: true }, (err, diferencia) => {
                                                                })
                                                            })
                                                        })
                                                    })

                                                } else if (parametros.golesEquipo1 < parametros.golesEquipo2) {
                                                    Equipos.findOneAndUpdate({ equipo: parametros.equipo1, liga: idLiga }, { $inc: { golesFavor: parametros.golesEquipo1, golesContra: parametros.golesEquipo2, puntos: perdedor, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
                                                        Equipos.findOneAndUpdate({ equipo: parametros.equipo1, liga: idLiga }, { diferenciaGoles: Number(equipoActualizado.golesFavor) - Number(equipoActualizado.golesContra) }, { new: true }, (err, diferencia) => {
                                                            Equipos.findOneAndUpdate({ equipo: parametros.equipo2, liga: idLiga }, { $inc: { golesFavor: parametros.golesEquipo2, golesContra: parametros.golesEquipo1, puntos: ganador, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
                                                                Equipos.findOneAndUpdate({ equipo: parametros.equipo2, liga: idLiga }, { diferenciaGoles: Number(equipoActualizado.golesFavor) - Number(equipoActualizado.golesContra) }, { new: true }, (err, diferencia) => {
                                                                })
                                                            })
                                                        })
                                                    })
                                                } else if (parametros.golesEquipo1 == parametros.golesEquipo2) {
                                                    Equipos.findOneAndUpdate({ equipo: parametros.equipo1, liga: idLiga }, { $inc: { golesFavor: parametros.golesEquipo1, golesContra: parametros.golesEquipo2, puntos: empate, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
                                                        Equipos.findOneAndUpdate({ equipo: parametros.equipo1, liga: idLiga }, { diferenciaGoles: Number(equipoActualizado.golesFavor) - Number(equipoActualizado.golesContra) }, { new: true }, (err, diferencia) => {
                                                            Equipos.findOneAndUpdate({ equipo: parametros.equipo2, liga: idLiga }, { $inc: { golesFavor: parametros.golesEquipo2, golesContra: parametros.golesEquipo1, puntos: empate, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
                                                                Equipos.findOneAndUpdate({ equipo: parametros.equipo2, liga: idLiga }, { diferenciaGoles: Number(equipoActualizado.golesFavor) - Number(equipoActualizado.golesContra) }, { new: true }, (err, diferencia) => {
                                                                })
                                                            })
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        } else {
                            return res.status(404).send({ mensaje: 'La jornada esta completa' })
                        }
                    })
                })
            } else {
                return res.status(404).send({ mensaje: 'No esta Autorizado' })
            }
        })
    } else {
        return res.status(404).send({ mensaje: 'Rellenar todos los campos' });
    }
}

//Exports
module.exports = {
    partido
}