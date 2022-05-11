const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuarios.routes');
const LigasRoutes = require('./src/routes/ligas.routes');
const equiposRoutes = require('./src/routes/equipos.routes');
const partidosRoutes = require('./src/routes/partidos.routes');



app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, LigasRoutes, equiposRoutes, partidosRoutes);

module.exports = app;