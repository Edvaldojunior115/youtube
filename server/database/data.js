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


// // Ejemplo de consulta a nuestra BD de todos los datos
// connection.query('SELECT * FROM usuario', (err, resultados, campos) => {

//     if (err) {
//         console.log('Error de sintax:', error);
//     }
//     if (resultados.length == 0) {
//         console.log('Base de Datos Vazía');

//     } else {

//         console.log('USUARIOS: ', resultados);
//     }
// });

module.exports = pool;