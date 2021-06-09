const pool = require('../database/data');
const path = require('path');

//CREAR SOLICITUD DE VIDEO
function CrearSolicitud(req, res) {
    let body = req.body;

    if (body.idusuario == '' || body.idusuario == undefined || body.url == '' || body.url == undefined) {

        return res.status(404).send({
            ok: false,
            message: 'POR FAVOR, LOS CAMPOS url E idusuario SON OBLIGATÓRIO.'
        });
    }

    const INSERT = `INSERT INTO solicitudvideo (id, url, autorizante, idusuario) VALUES
    (NULL, "${body.url}", "${body.autorizante}", "${body.idusuario}");`;

    pool.query(INSERT, (err, result) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'ERROR AL INTENTAR INSERTA LOS DATOS EN LA BASE DE DATOS: ',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).send({
                ok: false,
                message: '¡LA SOLICITUD NO HA SIDO CREADA!'

            });
        }

        return res.json({
            ok: true,
            message: '¡SOLICITUD DE VIDEO CREADA CON ÉXITO!',
            idInsetado: result.insertId
        });
    });
}


//SELECCIONAR VARIAS SOLICITUDES DE VIDEOS EN CASO DE QUE NO SE ESPECIFIQUE EL LEGAJO. 
//CASO EL LEGAJO SEA PASADO POR PARAMETRO, SI SELECCIONA UNO SÓLO. 
function SelectSolicitudUsuario(req, res) {


    let legajo = req.query.legajo;

    if (legajo == '' || legajo == undefined) {
        return res.status(406).send({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL LEGAJO DEL USUARIO QUE HA GENERADO LA SOLICITUD.'
        });
    }

    //SELECCIONAMOS LA(AS) SOLICITUD(ES) DE UN USUARIO ATRAVÉS DE SU LEGAJO.
    let SELECT = `SELECT usuario.nombre, solicitudvideo.id, solicitudvideo.titulo, solicitudvideo.url, solicitudvideo.minutos from solicitudvideo
    JOIN usuario on solicitudvideo.idusuario = usuario.id WHERE usuario.legajo= ${legajo};`;

    pool.query(SELECT, (err, result) => {

        if (err) {

            return res.status(504).send({
                ok: false,
                message: 'ERROR AL REALIZAR LA CONSULTA EN LA BASE DE DATOS.',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).json({
                ok: false,
                idSolicitud: idUsuario,
                message: 'EL USUARIO NO POSEE SOLICITUD(ES) DE VIDEO.',
                result
            });
        }

        return res.send({
            ok: true,
            message: 'SOLICITUD(ES) ENCONTRADA(S) DEL USUARIO.',
            result
        });
    });
}


//Para seleccionar una solicitud a través de un ID
function SelectSolicitud(req, res) {


    let id = req.query.id;

    if (id == '' || id == undefined) {
        return res.status(406).send({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL ID DE LA SOLICITUD.'
        });
    }

    //SELECCIONAMOS LA(AS) SOLICITUD(ES) DE UN USUARIO ATRAVÉS DE SU LEGAJO.
    let SELECT = `SELECT * from solicitudvideo WHERE id= ${id};`;

    pool.query(SELECT, (err, result) => {

        if (err) {

            return res.status().send({
                ok: false,
                message: 'ERROR AL REALIZAR LA CONSULTA EN LA BASE DE DATOS.',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).json({
                ok: false,
                idSolicitud: idUsuario,
                message: 'LA SOLICITUD CON ESTE ID NO EXISTE EN LA BASE DE DATOS.',
            });
        }

        return res.send({
            ok: true,
            message: 'SOLICITUD ENCONTRA: ',
            result
        });
    });
}


function SelectSolicitudes(req, res) {

    const SelectSolicitud = `SELECT usuario.nombre, solicitudvideo.id, solicitudvideo.titulo, solicitudvideo.url, solicitudvideo.minutos from solicitudvideo
    JOIN usuario on solicitudvideo.idusuario = usuario.id WHERE solicitudvideo.descargado = false;`

    pool.query(SelectSolicitud, (err, result) => {

        if (err) { throw err }

        if (result.length == 0) {

            return res.send({
                ok: true,
                message: 'OPS, NO HAY REGISTROS EN LA BASE DE DATOS',
                result
            });
        }

        res.send({
            ok: true,
            message: 'SOLICITUDES DE BASE DE DATOS: ',
            result
        });
    });
}

//Actualizar solicitud de video
function ActualizarSolicitud(req, res) {

    let body = req.body;

    if (body.id == '' || body.id == undefined) {

        return res.status(404).send({
            ok: true,
            message: 'POR FAVOR, ESPECIFIQUE EL ID DE LA SOLICITUD A ACTUALIZAR.'
        });
    }

    const UPDATE = `UPDATE solicitudvideo SET
        url = "${body.url}",
        autorizante = "${body.autorizante}" WHERE id = ${body.id}`;

    pool.query(UPDATE, (err, result) => {

        if (err) {
            return res.status(400).send({
                ok: true,
                message: '¡ERROR DE SINTAXIS!',
                err
            });
        }

        if (result.affectedRows == 0) {
            return res.status(404).json({
                ok: false,
                idSolicitud: body.id,
                message: '¡ID NO EXISTE EN LA BASE DE DATOS!',
            });
        }

        return res.send({
            ok: true,
            message: '¡SOLICITUD ACTUALIZADA CON ÉXITO!',
            TotalFilas: result.affectedRows
        });
    });
}

/**
 * ELIMINAR SOLICITUD DE VIDEO
 * obs: Ver ese tema, porque hoy en día no se eliminan más los usuarios. Hay que agregar un
 * atributo 'estado = activo o inactivo' y en base a eso controlamos los usuarios y no
 * eliminamos.
 */
function EliminarSolicitud(req, res) {

    let id = req.query.id;

    if (id == '' || id == undefined) {

        return res.status(404).send({
            ok: false,
            message: 'POR FAVOR, ESPECIFIQUE EL ID DE LA SOLICITUD A ELIMINAR.'
        });
    }

    const DELETE = `DELETE FROM solicitudvideo  WHERE id = ${id}`;

    pool.query(DELETE, (err, result) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                message: 'ERRO AL INTENTAR ELIMINAR SOLICITUD',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).send({
                ok: false,
                message: 'LA SOLICITUD NO HA SIDO ELIMINADA EN LA BASE DE DATOS.'

            });
        }

        return res.json({
            ok: true,
            message: '¡SOLICITUD ELIMINADA CON ÉXITO!',
            total: result.affectedRows
        });

    });
}

function ActualizarTituloSolicitud(req, res) {

    const body = req.body;

    if (!body.titulo | body.titulo == undefined && !body.id | body.id == undefined) {

        return res.status(404).json({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL ID Y TITULO DE LA SOLICITUD'
        });

    } else {

        const UPDATE = `UPDATE solicitudvideo SET
            titulo = "${body.titulo}.mp4" WHERE id = ${body.id}`;

        pool.query(UPDATE, (err, result) => {

            if (err) {
                return res.status(400).send({
                    ok: true,
                    message: '¡ERROR DE SINTAXIS!',
                    err
                });
            }

            if (result.affectedRows == 0) {
                return res.status(404).json({
                    ok: false,
                    idSolicitud: body.id,
                    message: '¡ID NO EXISTE EN LA BASE DE DATOS!',
                });
            }

            return res.send({
                ok: true,
                message: '¡TITULO DE SOLICITUD ACTUALIZADO CON ÉXITO!',
                TotalFilas: result.affectedRows
            });
        });
    }

}


function ActualizarStatusAndPathSolicitud(req, res) {

    let body = req.body;

    if (!body.TituloVideo | body.TituloVideo == undefined && !body.id | body.id == undefined) {

        return res.status(404).json({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL ID Y TITULO DE LA SOLICITUD'
        });
    }

    let idsolicitud = body.id;
    let titulo = body.TituloVideo;
    let minutos = body.Minutos;
    const url = path.resolve(__dirname, 'http://localhost:3000', 'verVideos?url=');
    const PathVideo = url.replace('C:\\Users\\edasilva\\Desktop\\CURSOS\\NODE\\10-YouTube\\server\\Controllers\\http:\\localhost:3000\\verVideos?url=', `http://localhost:3000/verVideos?url=${titulo}`);

    const UPDATE = `UPDATE solicitudvideo SET minutos = "${minutos}", titulo = "${titulo}", descargado = 1, path = "${PathVideo}.mp4" WHERE id = ${idsolicitud}`;

    pool.query(UPDATE, (err, result) => {

        if (err) {
            return res.status(400).json({
                ok: true,
                message: '¡ERROR DE SINTAXIS!',
                err
            });
        }

        if (result.affectedRows == 0) {
            return res.status(404).json({
                ok: false,
                idSolicitud: body.id,
                message: '¡ID NO EXISTE EN LA BASE DE DATOS!',
            });
        }

        return res.json({
            ok: true,
            message: '¡VIDEO HA SIDO DESCARGADO CORRECTAMENTE!',
            TotalFilas: result.affectedRows
        });
    });
}

function getUrlVideo(req, res) {

    let idUser = req.query.id;
    // let url = req.query.url;


    const SELECT = `SELECT solicitudvideo.path, solicitudvideo.titulo, solicitudvideo.id
                    FROM solicitudvideo LEFT JOIN usuario
                    ON solicitudvideo.idusuario = usuario.id
                    WHERE usuario.id= ${idUser} AND descargado = 1`;

    pool.query(SELECT, (err, result) => {

        if (err) {

            return res.status(404).json({
                ok: false,
                message: '¡NO EXISTE VIDEO DESCARGADO PARA ESE USUARIO!',
                err
            });
        }

        if (result.length == 0) {

            return res.status(404).json({
                ok: false,
                message: '¡EL USUARIO NO POSEE NINGUNA SOLICITUD!',
            });
        }


        return res.json({
            ok: true,
            message: 'VIDEOS DESCARGADOS PARA EL USUARIO:',
            result
        });

    });

}




module.exports = {
    CrearSolicitud,
    SelectSolicitudUsuario,
    ActualizarSolicitud,
    EliminarSolicitud,
    SelectSolicitud,
    SelectSolicitudes,
    ActualizarTituloSolicitud,
    ActualizarStatusAndPathSolicitud,
    getUrlVideo
}