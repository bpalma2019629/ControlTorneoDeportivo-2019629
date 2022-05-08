const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuarios.routes');
const LigasRoutes = require('./src/routes/ligas.routes');



app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, LigasRoutes);

module.exports = app;