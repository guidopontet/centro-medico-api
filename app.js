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
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imgRoutes = require('./routes/img');

// ==============================
//  Inicializar variables 
// ==============================
var app = express();

// ==============================
//  CORS 
// ==============================
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ==============================
//  Middlewares 
// ==============================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ==============================
//  Rutas 
// ==============================
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imgRoutes);

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