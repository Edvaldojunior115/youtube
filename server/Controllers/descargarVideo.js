const fs = require('fs');
/**
 * las importaciones a seguir son para video que poseen el audio incriptado, entonce se requiere
 * que sean descargados por separados. Y hacer la junción de estos:
 * const cp = require('child_process');
 * const readline = require('readline');
 * const ffmpeg = require('ffmpeg');
 * *LINK ABAJO DE INFORMACIÓN DE LIBRERÍA PARA VERSE SU IMPLEMENTACIÓN:
 * https://www.npmjs.com/package/ytdl-core#async-ytdl.getinfo(url%2C-%5Boptions%5D)
 */
const ytdl = require('ytdl-core');
const { promisify } = require('util');
const bodyParser = require('body-parser');
// const pool = require('../database/data');
const { body } = require('express-validator');

const ControllerSolicitudVideo = require('../Controllers/solicitudVideo');


// const getInfoVideo = promisify(ytdl.getInfo);



//Función para descargar el video, ver el video a seguir para terminar
//https://www.youtube.com/watch?v=jwaXo9WUCRo

// //SE DESCARGAR ÚNICAMENTE EL VIDEO, RECIBIENDO LA URL  A TRAVÉS DEL BODY
// async function DescargarVideo(req, res) {


//     if (!req.body.url) {
//         return res.status(200).json({
//             ok: false,
//             message: '¡ES NECESARIO ESPECIFICAR UNA URL!'
//         });
//     }

//     // //separamos la URL principal de Youtube que se repite siempre y quedamos
//     // //solamente con el código del video.
//     let IdVideo = req.body.url.replace('https://www.youtube.com/watch?v=', '');

//     if (!IdVideo) {
//         return res.status(200).json({
//             ok: false,
//             message: '¡NO EXISTE UN VIDEO PARA LA URL ESPECIFICADA!',
//             URL: req.body.url
//         });
//     }
//     const info = await ytdl.getInfo(IdVideo);



//     // Un vez que tenemos la información del video, a seguir hacemos el Download
//     // del video y guardamos en la carpeta queremos con su título.
//     ytdl(req.body.url)
//         .pipe(fs.createWriteStream('server/videos/' + info.videoDetails.title + '.mp4'))
//         .on('finish', (err, result) => {

//             if (err) {

//                 return res.status(500).json(err)

//             } else {

//                 return res.status(200).json({
//                     Ok: true,
//                     Message: 'Descarga del video concluída con éxito',
//                     Video: `${info.videoDetails.title}.mp4`,
//                     Minutos: info.videoDetails.lengthSeconds / 60,
//                     Descripcion: info.videoDetails.description
//                 });
//             }
//         });
// }


//SE DESCARGAR TANTO VIDEO COMO AUDIO, RECIBIENDO LA URL  A TRAVÉS DEL BODY
async function DescargarVideoAndAudio(req, res) {

    /**
     * Estudiar la siguiente codificación unir el video y el audio:
     * https://github.com/fent/node-ytdl-core/blob/HEAD/example/ffmpeg.js
     * */
    let url = req.body.url;

    if (url == '' || url == undefined) {
        return res.status(200).json({
            ok: false,
            message: '¡ES NECESARIO ESPECIFICAR LA URL Y EL ID DE LA SOLICITUD!'
        });
    }

    // const ref = 'https://www.youtube.com/watch?v=RAPrd4jpxxI';
    let IdVideo = url.replace('https://www.youtube.com/watch?v=', '');
    const info = await ytdl.getInfo(IdVideo)
        .then(response => {
            return response;
        })
        .catch(err => {

            if (err) {

                return res.json({
                    ok: false,
                    message: 'NO EXISTE UN VIDEO PARA LA URL: ' + url
                });
            }
        });


    const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
    };

    // Get audio and video streams
    const audio = ytdl(req.body.url, { quality: 'highestaudio' })
        .pipe(fs.createWriteStream('server/audios/' + 'Audio ' + info.videoDetails.title + '.mp3'))
        .on('progress', (_, downloaded, total) => {
            tracker.audio = { downloaded, total };
        });

    const video = ytdl(req.body.url)
        .pipe(fs.createWriteStream('server/videos/' + info.videoDetails.title + '.mp4'))
        .on('progress', (_, downloaded, total) => {
            tracker.video = { downloaded, total };
        })
        .on('finish', (err, result) => {

            if (err) {

                return res.status(500).json({
                    Ok: false,
                    Message: '¡NO HA SIDO POSIBLE DESCARGAR EL VIDEO!',
                    err
                });

            } else {

                return res.status(200).json({
                    Ok: true,
                    Message: 'Descarga del video concluída con éxito',
                    TituloVideo: `${info.videoDetails.title}`,
                    minutos: `${info.videoDetails.lengthSeconds / 60}`,
                    Descripcion: info.videoDetails.description,
                    result
                });
            }
        });
}


module.exports = {
    // DescargarVideo,
    DescargarVideoAndAudio
}