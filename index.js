
// Requires
const express = require('express');
require('./database');
const bodyParser = require('body-parser');

// Importar Rutas
const routes = require('./routes/rutas');
const usuario = require('./routes/usuario');
const login = require('./routes/login');
const hospital = require('./routes/hospital');
const medico = require('./routes/medico');
const busqueda = require('./routes/busqueda');
const upload = require('./routes/upload');
const imagenes = require('./routes/imagenes');

// Inicializar Variables
const app = express();

// Settings

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Server Index Config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
app.use('/usuario', usuario);
app.use('/hospital', hospital);
app.use('/medico', medico);
app.use('/login', login);
app.use('/busqueda', busqueda);
app.use('/upload', upload);
app.use('/img', imagenes);

app.use('/', routes);



// Iniciar servidor
app.listen(process.env.PORT || 3000, () => {
    console.log('Server on port 3000');
});