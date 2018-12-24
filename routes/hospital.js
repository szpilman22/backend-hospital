
const express = require('express');
const app = express();
const mdAuth = require('../middlewares/autenticacion');
const Hospital = require('../models/hospital');



// Obtener hospitales
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .populate('usuario', 'nombre email')
        .exec( (err, hospital) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospital',
                errors: err
            });            
        }

        Hospital.count({}, (err, conteo)=>{
            res.status(200).json({
                ok:true,
                hospital,
                conteo
            });
        });
        
    });

});

// Crear hospital
app.post('/', mdAuth.verificaToken, (req, res, next) => {

    const body = req.body;

    const hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// Editar hospital
app.put('/:id', mdAuth.verificaToken, (req, res, next) => {

    const id = req.params.id;
    const body = req.body;

    Hospital.findById( id, (err, hospital) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al editar hospital',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el ID ${ id } no existe`,
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al editar hospital',
                    errors: err
                });            
            }

            res.status(200).json({
                ok: true,
                usuario: hospitalGuardado
            });
        });
    });
});

// Borrar hospital
app.delete('/:id', mdAuth.verificaToken, (req, res, next) => {
    
    const id = req.params.id;

    Hospital.findByIdAndDelete( id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });            
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });        
    });




});

module.exports = app;
