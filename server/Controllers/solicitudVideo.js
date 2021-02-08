const pool = require('../config/data');


//CREAR SOLICITUD DE VIDEO
function CrearSolicitud(data, res) {

    const INSERT = `INSERT INTO solicitudvideo (id, url, titulo, minutos, idusuario) VALUES
    (NULL,
    "${data.url}", "${data.titulo}",
    "${data.minutos}", "${data.idusuario}");`;

    pool.query(INSERT, (err, result) => {

        if (err) {
            res.status(400).json({
                ok: false,
                message: 'ERROR AL INTENTAR INSERTA LOS DATOS EN LA BASE DE DATOS: ',
                err
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

    let SELECT = `SELECT * FROM solicitudvideo WHERE idusuario = ${data.idusuario};`;

    if (data.idusuario === '' || data.idusuario == undefined) {
        SELECT = "SELECT * FROM solicitudvideo";
    }

    pool.query(SELECT, (err, result) => {

        if (err) { throw err }

        if (result.length == 0) {
            return res.status(400).json({
                ok: false,
                idSolicitud: data.idusuario,
                message: 'LA SOLICITUD CON ESTE ID NO EXISTE EN LA BASE DE DATOS.',

            });
        }

        res.json({
            ok: true,
            message: 'SOLICITUD(ES) DE BASE DE DATOS',
            result
        });
    });
}


//Actualizar solicitud de video
function ActualizarSolicitud(data, res) {

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

    const DELETE = `DELETE FROM solicitudvideo  WHERE id = ${data.id}`;

    pool.query(DELETE, (err, result) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                message: 'ERRO AL INTENTAR ELIMINAR SOLICITUD',
                err
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