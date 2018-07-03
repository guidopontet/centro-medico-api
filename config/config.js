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
    jwt_seed: 'CrasSoftSeedSecure',
    item_per_page: 6,
    files: {
        validExtensions: {
            image: ['png', 'jpg', 'jpeg', 'gif']
        },
        validCollections: [ 'users', 'doctors', 'hospitals']
    }
};

module.exports = CONFIG;