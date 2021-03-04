const pool = require('../database/data');
const bcrypt = require('bcrypt');

//CREAR USUARIOS
function CrearUsuario(req, res) {
    let body = req.body;
    // const legajo = req.body.legajo;

    let dataUser = ({
        role: 'ROLE_USER',
        estatus: 1
    });

    if (body.legajo == '' || body.legajo == undefined || body.password == '' || body.password == undefined) {

        return res.status(406).send({
            ok: false,
            message: 'LEGAJO Y PASSWORD SON OBLIGATÓRIOS.'

        });
    }

    //REALIZAMOS LA INCRIPTACIÓN DE LA CONTRASEÑA
    const salt = bcrypt.genSaltSync();
    ContrasenaHash = bcrypt.hashSync(body.password, salt);

    //Preparamos la query
    const INSERT = `INSERT INTO usuario (id, legajo, nombre, apellido, email, password, role, estatus) VALUES 
    (NULL, "${body.legajo}", "${body.nombre}", "${body.apellido}", "${body.email}",
    "${ContrasenaHash}", "${dataUser.role}", "${dataUser.estatus}");`;

    pool.query(INSERT, (err, result) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'ERROR AL INSERTAR USUARIO EN BASE DE DATOS ',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).send({
                ok: false,
                message: 'EL USUARIO NO HA SICO CREADO.'
            });
        }

        res.json({
            ok: true,
            message: 'USUARIO CREADO CON ÉXITO',
            idInsetado: result.insertId
        });
    });
}


//SELECCIONAR VARIOS USUARIOS EN CASO DE QUE NO SE ESPECIFIQUE EL LEGAJO. 
//CASO EL LEGAJO SEA PASADO POR PARAMETRO, SI SELECCIONA UNO SÓLO. 
function SelectUsuario(req, res) {

    let legajo = req.query.legajo;

    if (legajo == '' || legajo == undefined) {

        return res.status(406).send({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL LEGAJO DEL USUARIO A CONSULTAR.'

        });

    }

    const SELECT = `SELECT legajo, nombre, apellido, email FROM usuario WHERE legajo = ${legajo} AND estatus = 1`;

    pool.query(SELECT, (err, result) => {

        if (err) {
            return result.status(400).send({
                ok: false,
                message: 'ERROR DE CONSULTA EN LA BASE DE DATOS',
                err
            });
        }

        //Al realizar la consulta si devuelve un arreglo vazío, significa que no hay datos
        if (result.length == 0) {
            return res.status(404).json({
                ok: false,
                message: 'OPS, NO HAY DATOS REGISTRADOS EN LA BASE DE DATOS'
            });
        }

        res.json({
            ok: true,
            message: 'USUARIO DE BASE DE DATOS',
            result
        });

    });
}


//Actualizar usuario
function ActualizarUsuario(req, res) {


    let body = req.body;

    if (body.legajo == '' || body.legajo == undefined) {

        return res.status(406).send({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL LEGAJO DEL USUARIO A ACTUALIZAR.'
        });
    }

    const UPDATE = `UPDATE usuario SET 
            nombre = "${body.nombre}",
            apellido = "${body.apellido}",
            email = "${body.email}" WHERE legajo = ${body.legajo} AND estatus = 1`;

    pool.query(UPDATE, (err, result) => {

        if (err) {
            res.status(400).send({
                ok: false,
                message: 'NO FUE POSIBLE ACTUALIZAR USUARIO',
                err
            });
        }

        res.send({
            ok: true,
            message: 'USUARIO ACTUALIZADO EN LA BASE DE DATOS: ',
            ColumnasAfectadas: result.affectedRows
        });
    });
}

/**
 * ELIMINAR USUARIO
 * obs: Ver ese tema, porque hoy en día no se eliminan más los usuarios. Hay que agregar un
 * atributo 'estado = activo o inactivo' y en base a eso controlamos los usuarios y no
 * eliminamos.
 */
function EliminarUsuario(req, res) {


    let legajo = req.query.legajo;


    if (legajo == '' || legajo == undefined) {

        return res.status(406).send({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL LEGAJO DEL USUARIO A ELIMINAR.'

        });
    }

    const desactivarUsuario = `UPDATE usuario SET estatus = 0 WHERE legajo = ${legajo}`;

    pool.query(desactivarUsuario, (err, result) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                message: 'ERROR AL INTENTAR ELIMINAR USUARIO.',
                err
            });
        }

        if (result.length == 0) {
            return res.status(404).send({
                ok: true,
                message: 'EL USUARIO NO HA SIDO ELIMINADO DE LA BASE DE DATOS',
            });
        }

        res.json({
            ok: true,
            message: 'EL USUARIO HA SIDO ELIMINADO:',
            ColumnasAfectadas: result.affectedRows
        });

    });
}

function LoginUSer(req, res) {

    let legajo = req.query.legajo;
    let password = req.query.password;

    if (legajo == '' || legajo == undefined || password == '' || password == undefined) {

        return res.status().send({
            ok: false,
            message: 'POR FAVOR INTRODUZCA EL LEGAJO Y EL PASSOWRD.'
        });
    }


    let SELECT = `SELECT legajo, password FROM usuario WHERE legajo = ${legajo} AND estatus = 1`;

    pool.query(SELECT, (err, result) => {

        if (err) {
            return result.status(400).send({
                ok: false,
                message: 'ERROR DE CONSULTA EN LA BASE DE DATOS',
                err
            });
        }

        //Al realizar la consulta si devuelve un arreglo vazío, significa que no hay datos
        if (result.length == 0) {
            return res.status(404).json({
                ok: false,
                message: 'NO EXISTE UN REGISTRO PARA ESE USUARIO.'
            });
        }

        /**
         * DESCODIFICAMOS EL PASSWORD RETORNADO AL REALIZAR LA CONSULTA.
         * LUEGO, CONTROLAMOS QUE EL LEGJAO Y PASSWORD PASADOS POR PARAMETROS SEAN LOS MISMO DE LA CONSULTA REALIZADA A LA BASE DE DATOS.
         */

        res.json({
            ok: true,
            message: 'USUARIO DE BASE DE DATOS',
            result
        });

    });

}

module.exports = {
    CrearUsuario,
    ActualizarUsuario,
    SelectUsuario,
    EliminarUsuario,
    LoginUSer
}