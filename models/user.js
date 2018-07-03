const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var mongoosePaginate = require('mongoose-paginate');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'El rol es necesario'],
        default: "USER_ROLE",
        uppercase: true,
        enum: validRoles
    },
});


// ==============================
//  Pluggins 
// ==============================
userSchema.plugin(mongoosePaginate);
// Plugin para devolver de manera mas legible el error de los campos unique
userSchema.plugin( uniqueValidator, { message: '{PATH} ya existe'});

module.exports = mongoose.model('User', userSchema);