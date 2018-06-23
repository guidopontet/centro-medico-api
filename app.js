const express = require('express');
const CONFIG = require('./config/config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// ==============================
//  Rutas 
// ==============================
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');

// ==============================
//  Inicializar variables 
// ==============================
var app = express();

// ==============================
//  Middlewares 
// ==============================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ==============================
//  Rutas 
// ==============================
app.use('/user', userRoutes);
app.use('/login', loginRoutes);

app.use('/', appRoutes);

// ==============================
//  Connect database 
// ==============================
mongoose.connection.openUri(`${CONFIG.db.host}:${CONFIG.db.port}/${CONFIG.db.name}`, (err, res) => {
    if (err) throw err;
    console.log(`Conectado a a base de datos ${CONFIG.db.name} en el puerto \x1b[32m%s\x1b[0m`, `${CONFIG.db.port}`);
});

// ==============================
//  Listen app 
// ==============================
app.listen(CONFIG.app.port, () => {
    console.log(`Express Server running on port ${CONFIG.app.port} \x1b[32m%s\x1b[0m`, 'ONLINE');
});