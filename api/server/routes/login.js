const express = require('express');
const sesionUser = require('../Controllers/usuario');

const app = express();

app.get('/login', sesionUser.LoginUSer);

module.exports = app;