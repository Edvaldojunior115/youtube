const pool = require('../config/data');
const bcrypt = require('bcrypt');



//CREAR USUARIOS
function CrearUsuario(usuario, res) {

    // estatus = parseInt(usuario.estatus);
    // legajo = parseInt(usuario.legajo);

    const Contrasenahash = bcrypt.hashSync(usuario.password, 10);

    const INSERT = `INSERT INTO usuario (id, legajo, nombre, apellido, email, password, role, estatus) VALUES 
    (NULL, "${usuario.legajo}", "${usuario.nombre}", "${usuario.apellido}", "${usuario.email}",
    "${Contrasenahash}", "${usuario.role}", "${usuario.estatus}");`;

    pool.query(INSERT, (err, result) => {

        if (err) {
            res.status(400).json({
                ok: false,
                message: 'ERROR AL INSERTAR USUARIO EN BASE DE DATOS ',
                err
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
function SelectUsuario(usuario, res) {

    let SELECT = `SELECT legajo, nombre, apellido, email FROM usuario WHERE legajo = ${usuario.legajo}`;

    if (usuario.legajo === '' || usuario.legajo == undefined) {
        SELECT = "SELECT * FROM usuario";
    }

    pool.query(SELECT, (err, result) => {

        if (err) { throw err }

        //SELECT * FROM usuario WHERE legajo = ${usuario.legajo} SI ENTRA CON ESA CONSULTA
        //BUSCANDO POR UN LEGAJO A UN USUARIO ESPECÍFICO
        if (SELECT !== "SELECT * FROM usuario") {

            if (result.length == 0) {
                return res.status(400).json({
                    ok: false,
                    legajoUser: usuario.legajo,
                    message: 'EL USUARIO NO EXISTE EN LA BASE DE DATOS.'
                });
            }

            res.json({
                ok: true,
                message: 'USUARIO(S) DE BASE DE DATOS',
                result
            });

        } else {

            //SELECT * FROM usuario SI ENTRA CON ESTA CONSULTA, SI NO HAY USUARIO REGISTRADO EN LA BD
            if (result.length == 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'OPS, NO HAY DATOS REGISTRADOS EN LA BASE DE DATOS'
                });
            }

            res.json({
                ok: true,
                message: 'USUARIO(S) DE BASE DE DATOS',
                result
            });
        }
    });
}


//Actualizar usuario
function ActualizarUsuario(usuario, res) {

    const UPDATE = `UPDATE usuario SET 
        nombre = "${usuario.nombre}",
        apellido = "${usuario.apellido}",
        email = "${usuario.email}" WHERE legajo = ${usuario.legajo}`;

    pool.query(UPDATE, (err, result) => {

        if (err) {
            res.status(400).send({
                ok: true,
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
function EliminarUsuario(usuario, res) {

    const desactivarUsuario = `UPDATE usuario SET estatus = 0 WHERE legajo = ${usuario.legajo}`;

    pool.query(desactivarUsuario, (err, result) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                message: 'ERROR DE CONSULTA SQL: ',
                err
            });
        }

        res.json({
            ok: true,
            message: 'EL USUARIO HA SIDO ELIMINADO:',
            usuario
        });

    });
}

module.exports = {
    CrearUsuario,
    ActualizarUsuario,
    SelectUsuario,
    EliminarUsuario
}