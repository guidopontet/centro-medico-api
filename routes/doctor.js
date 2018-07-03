const express = require('express');
const app = express();
const Doctor = require('../models/doctor');
const mdAuth = require('../middlewares/authentication');

// ==============================
//  Obtener doctores 
// ==============================
app.get('/', (req, res) => {
    Doctor.find()
        .populate('user', '-password')
        .populate('hospital')
        .exec((err, doctors) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al obtener doctores',
                err
            });
        }

        if (!doctors.length) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen doctores'
            });
        }

        res.status(200).json({
            ok: true,
            doctors
        });
    });
});

// ==============================
//  Crear un doctor 
// ==============================
app.post('/', mdAuth.tokenAuth, (req, res) => {
    let body = req.body;
    let userCreatorId = req.user._id;

    let doctor = new Doctor({
        name: body.name,
        user: userCreatorId,
        hospital: body.hospital
    });

    doctor.save((err, doctorCreated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al crear doctor',
                err
            });
        }

        res.status(200).json({
            ok: true,
            doctor: doctorCreated
        });
    });
});

// ==============================
//  Editar un doctor 
// ==============================
app.put('/:doctorId', mdAuth.tokenAuth, (req, res) => {
    let doctorId = req.params.doctorId;
    let body = req.body;
    Doctor.findByIdAndUpdate(doctorId, body, { new: true }, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al actualizar doctor',
                err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el doctor'
            });
        }

        res.status(200).json({
            ok: true,
            doctor
        });
    });
});

// ==============================
//  Eliminar un doctor 
// ==============================
app.delete('/:doctorId', mdAuth.tokenAuth, (req, res) => {
    let doctorId = req.params.doctorId;

    Doctor.findByIdAndRemove(doctorId, (err, doctorDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al eliminar doctor',
                err
            });
        }

        res.status(200).json({
            ok: true,
            doctor: doctorDeleted
        });
    });
});

module.exports = app;