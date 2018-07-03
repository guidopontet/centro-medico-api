const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

// ==============================
//  Busqueda general 
// ==============================
app.get('/all/:findText?', (req,res) => {

    let regexp = new RegExp(req.params.findText, 'i');

    Promise.all([
        findHospitals(regexp),
        findDoctors(regexp),
        findUsers(regexp)
    ])
        .then( response => {
            let [hospitals, doctors, users] = response;
            return res.status(200).json({
                ok: true,
                hospitals,
                doctors,
                users
            });
        })
        .catch( (msg, err) => {
            return res.status(200).json({
                ok: false,
                msg,
                err
            });
        });
});

// ==============================
//  Busqueda por colección 
// ==============================
app.get('/collection/:collectionName/:findText?', (req,res) => {

    let collectionName = req.params.collectionName;
    let regexp = new RegExp(req.params.findText, 'i');
    let promise;

    switch (collectionName) {
        case 'users':
            promise=findUsers(regexp);
            break;
        case 'doctors':
            promise=findDoctors(regexp);
            break;

        case 'hospitals':
            promise=findHospitals(regexp);
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: `${collectionName} no es una colección válida`
            });
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [collectionName]: data
        });
    })
    .catch((msg,err) => {
        return res.status(400).json({
            ok: false,
            msg,
            err
        });
    });

});

function findHospitals(regexp){
    return new Promise( (resolve, reject) => {
        Hospital.find({name: regexp})
            .populate('user', 'name email')
            .exec((err, hospitals) => {
            if(err) {
                reject('Error al cargar hospitales', err);
            }
            resolve(hospitals);
        });
     });
}

function findDoctors(regexp){
    return new Promise( (resolve, reject) => {
        Doctor.find({name: regexp})
            .populate('user','name email')
            .populate('hospital', 'name')
            .exec((err, doctors) => {
            if(err) {
                reject('Error al cargar doctores', err);
            }
            resolve(doctors);
        });
     });
}

function findUsers(regexp){
    return new Promise( (resolve, reject) => {
        User.find({},'-password')
            .or([{'name': regexp}, {'email': regexp}])
            .exec((err,users) => {
                if(err){
                    reject('Error al cargar usuarios', err);
                }
                resolve(users);
            });
     });
}

module.exports = app;