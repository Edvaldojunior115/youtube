require('./config/config');

const express = require('express');
const connection = require('./config/data');

const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// /configuración de Ruta global hacia todas la rutas de nuestra aplicación.
app.use(require('./routes/index'));


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});