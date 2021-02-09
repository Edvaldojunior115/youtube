const express = require('express');
const app = express();


const sesionUser = require('../Controllers/usuario');


app.post('/login', (req, res) => {

    let body = req.body;

    credenciales = ({
        legajo: body.legajo,
        passowrd: body.passowrd
    });

    if (credenciales.legajo != undefined && credenciales.passowrd != undefined) {

        sesionUser.LoginUSer(credenciales, res)

    } else {
        res.status(500).send({
            ok: false,
            message: 'ES NECESARIO INTRODUCIR EL LEGAJO Y EL PASSWORD.'

        });
    }

});


// //CONTROLAMOS QUE LOS DATOS PRINCIPALES HAYAN SIDO INTRODUCIDOS.
// //ADEMÁS INCRIPTAMOS LA CONTRASEÑA DE USUARIO.

// if (dataUser.password && dataUser.legajo) {

//     bcrypt.hash(dataUser.password, null, null, (err, hash) => {

//         if (err) {

//             throw err;

//         }

//         dataUser.password = hash;
//     });

// } else {

//     return res.status(500).send({
//         ok: false,
//         message: 'LA CONTRASEÑA Y LEGAJO SON CAMPOS OBLIGATORIAS.'
//     });

// }

module.exports = app;