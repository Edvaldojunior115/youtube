const pool = require('../config/data');

//CREAR SOLICITUD DE VIDEO
function CrearSolicitud(data, res) {


    if (data.idusuario == '' || data.idusuario == undefined || data.url == '' || data.url == undefined) {

        return res.status(404).send({
            ok: false,
            message: 'POR FAVOR, LOS CAMPOS url E idusuario SON OBLIGATÓRIO.'
        });
    }

    const INSERT = `INSERT INTO solicitudvideo (id, url, titulo, minutos, idusuario) VALUES
    (NULL, "${data.url}", "${data.titulo}", "${data.minutos}", "${data.idusuario}");`;

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
                message: 'LA SOLICITUD NO HA SIDO CREADA.'

            });
        }

        res.json({
            ok: true,
            message: 'SOLICITUD DE VIDEO CREADA CON ÉXITO',
            idInsetado: result.insertId
        });
    });
}


//SELECCIONAR VARIAS SOLICITUDES DE VIDEOS EN CASO DE QUE NO SE ESPECIFIQUE EL LEGAJO. 
//CASO EL LEGAJO SEA PASADO POR PARAMETRO, SI SELECCIONA UNO SÓLO. 
function SelectSolicitudUsuario(data, res) {

    if (data.idusuario == '' || data.idusuario == undefined) {
        return res.status(406).send({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL ID DEL USUARIO QUE HA GENERADO LA SOLICITUD.'
        });
    }

    let SELECT = `SELECT * FROM solicitudvideo WHERE idusuario = ${data.idusuario};`;

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
                idSolicitud: data.idusuario,
                message: 'LA SOLICITUD CON ESTE ID NO EXISTE EN LA BASE DE DATOS.',
            });
        }

        res.send({
            ok: true,
            message: 'SOLICITUD(ES) ENCONTRADA(S) PARA EL ID DE USUARIO ESPECIFICADO: ',
            result
        });
    });
}


//Actualizar solicitud de video
function ActualizarSolicitud(data, res) {

    if (data.id == '' || data.id == undefined) {

        return res.status(404).send({
            ok: true,
            message: 'POR FAVOR, ESPECIFIQUE EL ID DE LA SOLICITUD A ACTUALIZAR.'
        });
    }

    const UPDATE = `UPDATE solicitudvideo SET
        url = "${data.url}",
        titulo = "${data.titulo}",
        minutos = "${data.minutos}" WHERE id = ${data.id}`;

    pool.query(UPDATE, (err, result) => {

        if (err) {
            res.status(400).send({
                ok: true,
                message: 'NO FUE POSIBLE ACTUALIZAR LA SOLICITUD',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).json({
                ok: false,
                idSolicitud: data.idusuario,
                message: 'SOLICITUD NO HA SIDO ACTUALIZADA EN LA BASE DE DATOS.',
            });
        }

        res.send({
            ok: true,
            message: 'SOLICITUD ACTUALIZADA CON ÉXITO ',
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
function EliminarSolicitud(data, res) {

    if (data.id == '' || data.id == undefined) {

        return res.status(404).send({
            ok: true,
            message: 'POR FAVOR, ESPECIFIQUE EL ID DE LA SOLICITUD A ELIMINAR.'
        });
    }

    const DELETE = `DELETE FROM solicitudvideo  WHERE id = ${data.id}`;

    pool.query(DELETE, (err, result) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                message: 'ERRO AL INTENTAR ELIMINAR SOLICITUD',
                err
            });
        }

        if (result.length == 0) {
            res.status(404).send({
                ok: false,
                message: 'LA SOLICITUD NO HA SIDO ELIMINADA EN LA BASE DE DATOS.'

            });
        }

        res.json({
            ok: true,
            message: 'SOLICITUD ELIMINADA CON ÉXITO:',
            total: result.affectedRows
        });

    });
}

module.exports = {
    CrearSolicitud,
    SelectSolicitudUsuario,
    ActualizarSolicitud,
    EliminarSolicitud
}