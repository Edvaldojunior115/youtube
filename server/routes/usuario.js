const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ServiceUsuario = require('../Controlles/usuario');
const pool = require('../config/data');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Seleccionamos todos los usuarios de nuestra Base de Datos
app.get('/usuario', (req, res) => {

    const SelectUsuarios = "SELECT * FROM usuario";

    pool.query(SelectUsuarios, (err, result) => {
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

app.post('/usuario', (req, res) => {

    let body = req.body;
    let operacion = body.operacion;

    let dataUser = ({
        legajo: body.legajo,
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: body.password,
        estatus: body.estatus,
        role: body.role
    });


    switch (operacion) {

        case 'CREATE':
            ServiceUsuario.CrearUsuario(dataUser, res);
            break;

        case 'READ':
            ServiceUsuario.SelectUsuario(dataUser, res);
            break;

        case 'UPDATE':
            ServiceUsuario.ActualizarUsuario(dataUser, res);
            break;

        case 'DELETE':
            ServiceUsuario.EliminarUsuario(dataUser, res);
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