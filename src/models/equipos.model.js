const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquiposSchema = Schema({
    equipo: String,
    puntos: Number,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number,
    partidosJugados: Number,
    liga: {type: Schema.Types.ObjectId, ref:'ligas'}
});

module.exports = mongoose.model('equipos', EquiposSchema);