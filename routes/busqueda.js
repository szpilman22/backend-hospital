
const express = require('express');

const app = express();

const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');


// Busqueda Especifica
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var expreg = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expreg);
            break;
        
        case 'medicos':
            promesa = buscarMedicos(busqueda, expreg);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, expreg);
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los parametros de busqueda validos son: Usuarios, Medicos u Hospitales'
        });
    }

    promesa.then( data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});


// Busqueda General
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var expreg = new RegExp(busqueda, 'i');

    Promise.all([ 
        buscarHospitales(busqueda, expreg),
        buscarMedicos(busqueda, expreg),
        buscarUsuarios(busqueda, expreg)])
            .then(respuestas => {

                res.status(200). json({
                    ok: true,
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });

            });    
});

function buscarHospitales(busqueda, expreg) {
        
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: expreg })
                .populate('usuario', 'nombre email')
                .exec((err, hospitales)=>{
            if (err) {
                reject('Error al cargar Hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busqueda, expreg) {
    
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: expreg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos)=>{
            if (err) {
                reject('Error al cargar los Medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, expreg) {
    
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
                .or([{ 'nombre': expreg }, { 'email': expreg }])
                .exec((err, usuarios) => {
                    if (err) {
                        reject('Error al cargar lo Usuarios');
                    }else{
                        resolve(usuarios);
                    }
                });
    });
}

module.exports = app;