const express = require('express');
// const bodyParser = require('body-parser');

const app = express();

const ControllerUsuario = require('../Controllers/usuario');
const pool = require('../config/data');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

//Seleccionamos todos los usuarios de nuestra Base de Datos
app.get('/usuarios', (res) => {

    const SelectUsuarios = "SELECT * FROM usuario WHERE estatus = 1";

    pool.query(SelectUsuarios, (err, result) => {

        if (err) { throw err }

        if (result.length == 0) {

            return res.json({
                ok: true,
                message: 'OPS, NO HAY REGISTROS EN LA BASE DE DATOS'
            });
        }

        res.send({
            ok: true,
            message: 'USUARIOS DE BASE DE DATOS:',
            result
        });
    });

});


app.get('/usuario', ControllerUsuario.SelectUsuario);

app.post('/usuario', ControllerUsuario.CrearUsuario);

app.put('/usuario', ControllerUsuario.ActualizarUsuario);

app.delete('/usuario', ControllerUsuario.EliminarUsuario);




module.exports = app;