const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.get('/:collection/:img', (req, res) => {

    let collection = req.params.collection;
    let image = req.params.img;
    let imagePath = path.resolve(__dirname, `../uploads/${collection}/${image}`);

    if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        return res.sendFile(pathNoImage);
    }
});

module.exports = app;