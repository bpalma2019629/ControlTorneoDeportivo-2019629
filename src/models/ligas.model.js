const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LigasSchema = Schema({
    liga: String,
    idUser: {type: Schema.Types.ObjectId, ref:'usuarios'}
});

module.exports = mongoose.model('ligas', LigasSchema);