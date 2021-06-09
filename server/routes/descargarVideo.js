const express = require('express');
const path = require('path');
var cors = require('cors');

// const bodyParser = require('body-parser');
const app = express();

app.use(cors());

const ControllerDescargarVideo = require('../Controllers/descargarVideo');
const ControllerSolicitudVideo = require('../Controllers/solicitudVideo');



// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     // res.header('Access-Control-Allow-Origin: *');
//     res.header('Access-Control-Allow-Credentials:', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');


//     // res.header('access-Control-Allow_Headers', 'Origin, X-API-KEY, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Allow-Method');
//     // res.header('Allow', 'GET, PUT, POST, DELETE');
//     this.app.use(cors());
//     next();
// });


//Petición para ver las urls de los videos que se encuentra descargadas para un usuario.
app.get('/misVideos', ControllerSolicitudVideo.getUrlVideo);

//Petición para acceder a los videos descargados
app.get('/verVideos', (req, res) => {

    let video = req.query.url;
    const pathUrl = path.resolve(__dirname, '../videos/', video);
    res.sendFile(pathUrl);
});

app.post('/descargarvideo', ControllerDescargarVideo.DescargarVideoAndAudio);

module.exports = app;