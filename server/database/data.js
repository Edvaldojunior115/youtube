const mysql = require('mysql');

const configuracionBD = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'youtube'
}

//Para eficiencia creamos un pool de MySQL, que nos permite utilizar múltiples conexiones
//a la vez en lugar de tener que manualmente abrir y cerrar conexiones múltiples.
const pool = mysql.createPool(configuracionBD);


module.exports = pool;