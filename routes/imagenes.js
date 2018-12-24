const express = require('express');
const app = express();
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var paths = `./uploads/${tipo}/${img}`;

    fs.exists(paths, existe => {
        
        if (!existe) {
            paths = './assets/img/no-image-icon-15.png';
        }

        res.sendFile(paths, {root: '.'});
    });
});

module.exports = app;