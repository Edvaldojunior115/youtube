const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ServiceSolicitud = require('../Controlles/solicitudVideo');
const pool = require('../config/data');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Seleccionamos todos los usuarios de nuestra Base de Datos
app.get('/youtube', (req, res) => {

    const SelectSolicitud = "SELECT * FROM solicitudvideo";

    pool.query(SelectSolicitud, (err, result) => {
        if (err) { throw err }

        if (result.length == 0) {

            return res.json({
                ok: true,
                message: 'OPS, NO HAY REGISTROS EN LA BASE DE DATOS'

            });
        }

        res.send(result);
    });
});

app.post('/youtube', (req, res) => {

    let body = req.body;
    let operacion = body.operacion;

    let data = ({
        id: body.id,
        url: body.url,
        titulo: body.titulo,
        minutos: body.minutos,
        idusuario: body.idusuario
    });

    switch (operacion) {

        case 'CREATE':
            ServiceSolicitud.CrearSolicitud(data, res);
            break;

        case 'READ':
            ServiceSolicitud.SelectSolicitudUsuario(data, res);
            break;

        case 'UPDATE':
            ServiceSolicitud.ActualizarSolicitud(data, res);
            break;

        case 'DELETE':
            ServiceSolicitud.EliminarSolicitud(data, res);
            break;

        default:
            res.status(400).json({
                ok: false,
                message: 'DEBES PROVEER UNA OPERACIÓN A REALIZAR ---> INSERT, UPDATE, READ, DELETE'
            });
            break;
    }

});

module.exports = app;