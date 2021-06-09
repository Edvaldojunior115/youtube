const express = require('express');
const app = express();


//Aqui se define todas las rutas que va a tener nuestra aplicación.
app.use(require('./usuario'));
app.use(require('./solicitud'));
app.use(require('./login'));
app.use(require('./descargarVideo'));

module.exports = app;