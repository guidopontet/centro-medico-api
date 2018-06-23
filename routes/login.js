const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

// ==============================
//  Login de usuario 
// ==============================
app.post('/', (req,res) => {
    let body = req.body;

    User.findOne( {email: body.email}, (err, user) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                msg: 'Error al loguear usuario',
                err
            });
        }
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        if( !bcrypt.compareSync( body.password, user.password)){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }

        user.password='=D';
        // Token expira en 4 horas
        let token = jwt.sign( {user}, CONFIG.jwt_seed, { expiresIn: 14400});

        res.status(200).json({
            ok: true,
            user,
            token
        });
    });
});

module.exports = app;