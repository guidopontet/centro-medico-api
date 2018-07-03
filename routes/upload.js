const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const validExtensions = require('../config/config.js').files.validExtensions.image;
const validCollections = require('../config/config.js').files.validCollections;
const fileSystem = require('fs');

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');

// ==============================
//  Middleware para obtener imagen subida 
// ==============================
app.use(fileUpload());

// ==============================
//  Subir una imagen 
// ==============================
app.put('/:collection/:idDocument', (req, res) => {

    let collection = req.params.collection;
    let idDocument = req.params.idDocument;

    // Validamos la colección ingresada
    if (!validCollections.includes(collection)) {
        return res.status(200).json({
            ok: false,
            mgs: `La colección '${collection}' no es válida'. Las colecciones válidas son ${validCollections.join(', ')}`
        });
    }

    // Validación del envío de algún archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha subido ninguna imagen'
        });
    }

    // Validación del envío de un archivo con el KEY 'image'
    if (!req.files.image) {
        return res.status(400).json({
            ok: false,
            msg: 'El KEY del archivo tiene que ser \'image\''
        });
    }

    // Validamos la extensión de la imagen
    let file = req.files.image;
    let fileExt = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExt)) {
        return res.status(400).json({
            ok: false,
            mgs: `La extensión '${fileExt}' no es válida'. Las extensiones válidas son ${validExtensions.join(', ')}`
        });
    }

    let imageName = `${idDocument}-${new Date().getMilliseconds()}.${fileExt}`;
    let imagePath = `./uploads/${collection}/${imageName}`;

    // Almacenar la imagen en el FileSystem
    file.mv(imagePath, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la imagen',
                err
            });
        }

        // Asignar la imagen a la colección correspondiente
        asignImageToDocument(collection, idDocument, imageName, res);

    });
});

// Funcion para asignar la imagen a la colección correcta acorde al tipo del document (user, doctor, hospital)
function asignImageToDocument(collection, idDocument, imageName, res) {
    switch (collection) {
        case 'users':
            User.findById(idDocument, (err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al asignar la imagen al usuario',
                        err
                    });
                }
                if (!user) {
                    return res.status(400).json({
                        ok: false,
                        msg: `No existe un usuario con el id '${idDocument}'`
                    });
                }

                let imagePathOld = `./uploads/${collection}/${user.img}`;

                // Si ya tiene una imagen anterior de perfil, la borramos
                if (fileSystem.existsSync(imagePathOld)) {
                    fileSystem.unlinkSync(imagePathOld);
                }

                user.img = imageName;
                user.save((err, userUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al asignar la imagen al usuario',
                            err
                        });
                    }

                    userUpdated.password = '=)';
                    return res.status(200).json({
                        ok: true,
                        msg: 'Imagen de usuario actualizada',
                        user: userUpdated
                    });
                });

            });
            break;
        case 'doctors':
            Doctor.findById(idDocument, (err, doctor) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al asignar la imagen al doctor',
                        err
                    });
                }
                if (!doctor) {
                    return res.status(400).json({
                        ok: false,
                        msg: `No existe un doctor con el id '${idDocument}'`
                    });
                }

                let imagePathOld = `./uploads/${collection}/${doctor.img}`;

                // Si ya tiene una imagen anterior de perfil, la borramos
                if (fileSystem.existsSync(imagePathOld)) {
                    fileSystem.unlinkSync(imagePathOld);
                }

                doctor.img = imageName;
                doctor.save((err, doctorUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al asignar la imagen al usuario',
                            err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        msg: 'Imagen de doctor actualizada',
                        doctor: doctorUpdated
                    });
                });

            });
            break;
        case 'hospitals':
            Hospital.findById(idDocument, (err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al asignar la imagen al hospital',
                        err
                    });
                }
                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        msg: `No existe un hospital con el id '${idDocument}'`
                    });
                }

                let imagePathOld = `./uploads/${collection}/${hospital.img}`;

                // Si ya tiene una imagen anterior de perfil, la borramos
                if (fileSystem.existsSync(imagePathOld)) {
                    fileSystem.unlinkSync(imagePathOld);
                }

                hospital.img = imageName;
                hospital.save((err, hospitalUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al asignar la imagen al hospital',
                            err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        msg: 'Imagen de hospital actualizada',
                        hospital: hospitalUpdated
                    });
                });

            });
            break;
    }
}

module.exports = app;