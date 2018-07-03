const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let hospitalSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {collection: 'hospitals'});

// Plugin para devolver de manera mas legible el error de los campos unique
hospitalSchema.plugin( uniqueValidator, { message: '{PATH} ya existe'});

module.exports = mongoose.model('Hospital', hospitalSchema);