const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartidosSchema = Schema({
    jornada: Number,
    equipo1: String,
    equipo2: String,
    golesEquipo1: Number,
    golesEquipo2: Number,
    idLiga: {type: Schema.Types.ObjectId, ref:'ligas'}
});

module.exports = mongoose.model('partidos', PartidosSchema);