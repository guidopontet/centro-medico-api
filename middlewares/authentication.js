// ==============================
//  Verificar el token en las peticiones 
// ==============================
let jwt = require('jsonwebtoken');
let CONFIG = require('../config/config');

module.exports.tokenAuth = (req, res, next) => {
    let token = req.headers.authorization;

    jwt.verify(token, CONFIG.jwt_seed, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                ok: false,
                msg: 'Acceso no autorizado',
                err
            });
        }

        req.user = decoded;

        next();
    });
};