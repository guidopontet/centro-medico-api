// ==============================
//  Archivo de configuración 
// ==============================
let CONFIG = {
    app: {
        port: 3000
    },
    db: {
        host: 'mongodb://localhost',
        port: 27017,
        name: 'centroMedicoDB'
    },
    jwt_seed: 'CrasSoftSeedSecure'
};

module.exports = CONFIG;