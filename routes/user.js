const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const mdAuth = require('../middlewares/authentication');
const items_per_page = require('../config/config').item_per_page;


// ==============================
//  Obtener usuarios 
// ==============================
app.get('/:page?', (req, res) => {
    
    let page = Number(req.params.page || 1);

    User.paginate({}, { page: page, limit: items_per_page }, (err, data) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error buscando usuarios',
                        err
                    });
                }

                if(page > data.pages){
                    return res.status(400).json({
                        ok: false,
                        msg: 'No existen más usuarios'
                    });
                }

                res.status(200).json({
                    ok: true,
                    users: data.docs,
                    page: data.page,
                    pages: data.pages,
                    total: data.total
                });
            }
        );
});

// ==============================
//  Crear usuarios 
// ==============================
app.post('/', mdAuth.tokenAuth, (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password),
        img: body.img,
        role: body.role
    });

    user.save( (err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar usuario',
                err
            });
        }
        res.status(201).json({
            ok: true,
            user: userSaved
        });

    });

}); 

// ==============================
//  Actualizar usuario 
// ==============================
app.put('/:userId', mdAuth.tokenAuth ,(req,res) => {
    let userId = req.params.userId;
    let body = req.body;

    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al recuperar usuario',
                err
            });
        }
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario' 
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al actualizar usuario',
                    err
                });
            }
            userSaved.password="=D";
            res.status(200).json({
                ok: true,
                user: userSaved
            });
        });
    });
});

// ==============================
//  Borrar usuario 
// ==============================
app.delete('/:userId', mdAuth.tokenAuth, (req, res) => {
    let userId = req.params.userId;

    User.findByIdAndRemove( userId, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar usuario',
                err
            });
        }

        if( !userDeleted){
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    });
});

module.exports = app;