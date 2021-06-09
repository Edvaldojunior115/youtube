const express = require('express');
const sesionUser = require('../Controllers/usuario');

const app = express();

var cors = require('cors');
app.use(cors());



app.post('/login', sesionUser.Login);




module.exports = app;