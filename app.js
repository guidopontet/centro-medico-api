const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');


/* ----- ----- INICIALIZAR VARIABLES ----- ----- */
var app = express();


/* ----- ----- RUTAS ----- ----- */
app.get('/', (req, res, next) => {
    console.log(req);
    res.status(200).json({
        ok: true,
        mensaje: "Peticion correcta"
    });
});

/* ----- ----- CONEXION BASE DE DATOS ----- ----- */
mongoose.connection.openUri(`${config.db.host}:${config.db.port}/${config.db.name}`, (err, res) => {
    if (err) throw err;
    console.log(`Conectado a a base de datos ${config.db.name} en el puerto \x1b[32m%s\x1b[0m`, `${config.db.port}`);
})

/* ----- ----- LISTEN ----- ----- */
app.listen(config.app.port, () => {
    console.log(`Express Server running on port ${config.app.port} \x1b[32m%s\x1b[0m`, 'ONLINE');
});