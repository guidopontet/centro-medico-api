const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const mdAuth = require('../middlewares/authentication');

// ==============================
//  Obtener hospitales 
// ==============================
app.get('/', (req, res) => {
    Hospital.find({})
        .populate('user', '-password')
        .exec((err, hospitals) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener hospitales',
                err
            });
        }

        if (!hospitals.length) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen hospitales'
            });
        }

        res.status(200).json({
            ok: true,
            hospitals
        });
    })
});

// ==============================
//  Crear hospital 
// ==============================
app.post('/', mdAuth.tokenAuth, (req, res) => {
    let body = req.body;
    let userCreatorId = req.user._id;

    let hospital = new Hospital({
        name: body.name,
        user: userCreatorId
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar hospital',
                err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalSaved
        });
    });
});

// ==============================
//  Actualizar Hospital 
// ==============================
app.put('/:hospitalId', mdAuth.tokenAuth, (req, res) => {
    let hospitalId = req.params.hospitalId;
    let body = req.body;
    let userUpdaterId = req.user._id;

    Hospital.findOne({ _id: hospitalId }, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener hospital',
                err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el hospital'
            });
        }

        hospital.name = body.name;
        hospital.save((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al actualizar el hospital',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                hospital
            });
        });
    });

});

// ==============================
//  Eliminar hospital 
// ==============================
app.delete('/:hospitalId', mdAuth.tokenAuth, (req,res) => {
    let hospitalId = req.params.hospitalId;

    Hospital.findByIdAndRemove({_id: hospitalId}, (err, hospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar hospital',
                err
            });
        }

        res.status(200).json({
            ok: true,
            hospitalDeleted
        });
    });
});

module.exports = app;