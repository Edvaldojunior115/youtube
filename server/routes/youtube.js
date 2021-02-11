const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ControllerSolicitud = require('../Controllers/solicitudVideo');
const pool = require('../config/data');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Seleccionamos todos los usuarios de nuestra Base de Datos
app.get('/youtube', (res) => {

    const SelectSolicitud = "SELECT * FROM solicitudvideo";

    pool.query(SelectSolicitud, (err, result) => {
        if (err) { throw err }

        if (result.length == 0) {

            return res.status(404).send({
                ok: true,
                message: 'OPS, NO HAY REGISTROS EN LA BASE DE DATOS'

            });
        }

        res.send({
            ok: true,
            message: 'SOLICITUDES DE BASE DE DATOS: ',
            result
        });
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
            ControllerSolicitud.CrearSolicitud(data, res);
            break;

        case 'READ':
            ControllerSolicitud.SelectSolicitudUsuario(data, res);
            break;

        case 'UPDATE':
            ControllerSolicitud.ActualizarSolicitud(data, res);
            break;

        case 'DELETE':
            ControllerSolicitud.EliminarSolicitud(data, res);
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