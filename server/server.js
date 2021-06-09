require('./config/config');
var cors = require('cors');
const express = require('express');
// const connection = require('./config/data');

const app = express();

const bodyParser = require('body-parser');

//configuración CORS
app.use(cors({ origin: true, credentials: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



// /configuración de Ruta global hacia todas la rutas de nuestra aplicación.
app.use(require('./routes/index'));

//haceoms publica la pasta para acceder al video descargado
// app.use(express.static(path(__dirname, 'videos')));

// app.use(express.static('public'));



app.listen(process.env.PORT, () => {
    console.log('ESCUCHANDO PUERTO: ', process.env.PORT);
});