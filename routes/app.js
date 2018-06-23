const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    console.log(req);
    res.status(200).json({
        ok: true,
        mensaje: "Peticion correcta"
    });
});

module.exports = app;