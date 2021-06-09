const express = require('express');
// const bodyParser = require('body-parser');
const app = express();

var cors = require('cors');

app.use(cors());

const ControllerUsuario = require('../Controllers/usuario');
// const pool = require('../database/data');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));


// app.use((req, res, next) => {
//     // res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Origin: *');
//     res.header('Access-Control-Allow-Credentials: true');
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');


//     // res.header('access-Control-Allow_Headers', 'Origin, X-API-KEY, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Allow-Method');
//     // res.header('Allow', 'GET, PUT, POST, DELETE');
//     this.app.use(cors());
//     next();
// });

//Seleccionamos todos los usuarios de nuestra Base de Datos
app.get('/usuarios', ControllerUsuario.SeletcSolicitudUsuario);


//Seleccionamos un usuario
app.get('/usuario', ControllerUsuario.SelectUsuario);
app.get('/UsuarioPorID', ControllerUsuario.SelectUsuarioPorID);

app.post('/usuario', ControllerUsuario.CrearUsuario);


app.put('/usuario', ControllerUsuario.ActualizarUsuario);

app.delete('/usuario', ControllerUsuario.EliminarUsuario);






module.exports = app;