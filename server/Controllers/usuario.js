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
                message: 'EL USUARIO NO HA SIDO CREADO.'
            });
        }

        res.json({
            ok: true,
            message: 'EL USUARIO HA SIDO CREADO CON ÉXITO',
            idInsetado: result.insertId
        });
    });
}

//Seleccionamos todos los usaurios
function SeletcSolicitudUsuario(req, res) {

    const SelectUsuarios = "SELECT usuario.id, usuario.legajo, usuario.nombre, usuario.apellido, usuario.email, usuario.role FROM usuario LEFT JOIN solicitudvideo on usuario.id = solicitudvideo.idusuario WHERE usuario.estatus = 1 AND solicitudvideo.descargado != 1; ";

    pool.query(SelectUsuarios, (err, result) => {

        if (err) { throw err }

        if (result.length == 0) {

            return res.json({
                ok: true,
                message: 'OPS, NO HAY REGISTROS EN LA BASE DE DATOS',
                result
            });
        }

        return res.send({
            ok: true,
            message: 'USUARIOS DE BASE DE DATOS:',
            result
        });
    });

}
//SELECCIONAR VARIOS USUARIOS EN CASO DE QUE NO SE ESPECIFIQUE EL LEGAJO. 
//CASO EL LEGAJO SEA PASADO POR PARAMETRO, SI SELECCIONA UNO SÓLO. 
function SelectUsuario(req, res) {

    let legajo = req.query.legajo;

    if (legajo == '' || legajo == undefined) {

        return res.status(406).json({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL LEGAJO DEL USUARIO.'
        });

    }

    const SELECT = `SELECT * FROM usuario WHERE legajo = ${legajo} AND estatus = 1`;

    pool.query(SELECT, (err, result) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'ERROR DE CONSULTA EN LA BASE DE DATOS',
                err
            });
        }

        //Al realizar la consulta si devuelve un arreglo vazío, significa que no hay datos
        if (result.length == 0) {

            return res.status(404).json({
                ok: false,
                message: 'NO EXISTE UN USUARIO REGISTRADO EN LA BASE DE DATOS'
            });
        }

        return res.json({
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

        return res.status(406).json({
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
            return res.status(400).json({
                ok: false,
                message: '¡NO FUE POSIBLE ACTUALIZAR USUARIO!',
                err
            });
        }

        if (!result.affectedRows) {

            return res.json({
                ok: false,
                message: 'EL USUARIO QUE HAS INTENTADO ACTUALIZAR NO EXISTE EN LA BASE DE DATOS.',
            });

        } else {

            return res.json({
                ok: true,
                message: '¡EL USUARIO HA SIDO ACTUALIZADO CON ÉXITO!',
                UsuarioAfectados: result.affectedRows
            });
        }

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

        return res.status(406).json({
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

        if (result.affectedRows == 0) {
            return res.status(404).json({
                ok: true,
                message: 'EL USUARIO NO HA SIDO ELIMINADO DE LA BASE DE DATOS',
            });

        } else {

            return res.json({
                ok: true,
                ColumnasAfectadas: result.affectedRows,
                message: '¡EL USUARIO HA SIDO ELIMINADO CON ÉXITO!'
            });
        }

    });
}




function SelectUsuarioPorID(req, res) {

    let id = req.query.id;

    if (id == '' || id == undefined) {

        return res.status(406).json({
            ok: false,
            message: 'ES NECESARIO ESPECIFICAR EL ID DEL USUARIO A CONSULTAR.'
        });

    }

    const SELECT = `SELECT * FROM usuario WHERE id = ${id} AND estatus = 1`;

    pool.query(SELECT, (err, result) => {

        if (err) {
            return result.status(400).json({
                ok: false,
                message: 'ERROR DE CONSULTA EN LA BASE DE DATOS',
                err
            });
        }

        //Al realizar la consulta si devuelve un arreglo vazío, significa que no hay datos
        if (result.length == 0) {
            return res.status(404).json({
                ok: false,
                message: 'NO EXISTE UN USUARIO REGISTRADO CON ESTE LEGAJO EN LA BASE DE DATOS'
            });
        }

        return res.json({
            ok: true,
            message: 'USUARIO DE BASE DE DATOS',
            result
        });

    });
}



function Login(req, res) {

    const body = req.body;

    if (body.passwordbd == '' || body.passwordbd == undefined && body.passwordUser == '' || body.passwordUser == undefined) {

        return res.status(402).json({
            ok: false,
            message: 'POR FAVOR INTRODUZCA EL PASSOWRD.'
        });
    }

    checkUser(body).then((result) => {

        if (!result) {

            return res.status(404).json({
                ok: false,
                message: 'USUARIO/CONTRASEÑA SON INCORRECTOS.'
            });

        } else {

            return res.json({
                ok: true,
                message: '¡BIENVENIDO(A) A AGDTube!'
            });
        }

    }).catch((err) => {
        console.log(err);

    });

}


async function checkUser(user) {


    const match = await bcrypt.compare(user.passwordUser, user.passwordbd);

    if (match) {
        return true;
    } else {
        return false
    }
}



module.exports = {
    CrearUsuario,
    ActualizarUsuario,
    SelectUsuario,
    EliminarUsuario,
    SeletcSolicitudUsuario,
    SelectUsuarioPorID,
    Login
}