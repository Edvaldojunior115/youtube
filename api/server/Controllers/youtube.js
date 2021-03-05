const fs = require('fs')
const youtubedl = require('youtube-dl')



function DescargarVideo(video, res) {
    const url = video.url;
    const proxy = 'http://proxy.agdcorp.com.ar';
    const port = '8080';

    const video = youtubedl(url,
        // Argumentos opcionales pasados ​​a youtube-dl.
        ['--proxy', proxy + ':' + port], ['--format=18'],
        // Se pueden dar opciones adicionales para llamar a `child_process.execFile ()`.
        // El directorio para guardar los archivos descargados en. 
        { cwd: __dirname })

    // Se llamará cuando comience la descarga.
    video.on('Información', function(info) {
        console.log('INICIANDO DOWNLOAD')
        console.log('Nombre de Archivo: ' + info._filename)
        console.log('Tamaño: ' + info.size)
    });

    video.pipe(fs.createWriteStream('myvideo.mp4'));
}


module.exports = {
    DescargarVideo
}