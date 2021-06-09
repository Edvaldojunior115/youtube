const express = require('express');
const app = express();

var cors = require('cors');
app.use(cors());

const ControllerSolicitud = require('../Controllers/solicitudVideo');

//Activamos el cors para poder tener acceso a nuestros servicio desde otro servidor.


//Seleccionamos todos los usuarios de nuestra Base de Datos
app.get('/solicitudes', ControllerSolicitud.SelectSolicitudes);

app.get('/solicitud', ControllerSolicitud.SelectSolicitudUsuario);

app.get('/UnaSolicitud', ControllerSolicitud.SelectSolicitud);

app.post('/solicitud', ControllerSolicitud.CrearSolicitud);

app.put('/solicitud', ControllerSolicitud.ActualizarSolicitud);

app.put('/solicitudTitulo', ControllerSolicitud.ActualizarTituloSolicitud);

app.put('/StatusVideo', ControllerSolicitud.ActualizarStatusAndPathSolicitud);

app.delete('/solicitud', ControllerSolicitud.EliminarSolicitud);

module.exports = app;