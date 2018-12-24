
const express = require('express');
const app = express();
const mdAuth = require('../middlewares/autenticacion');
const Medico = require('../models/medico');

// Obtener medicos
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err, medico) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medico',
                errors: err
            });            
        }
        
        Medico.count({}, (err, conteo)=>{
            res.status(200).json({
                ok:true,
                medico,
                conteo
            });
        });
    });

});

// Crear medicos
app.post('/', mdAuth.verificaToken, (req, res, next) => {

    const body = req.body;

    const medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( (err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medicos: medicoGuardado
        });
    });
});

// Editar medicos
app.put('/:id', mdAuth.verificaToken, (req, res, next) => {

    const id = req.params.id;
    const body = req.body;

    Medico.findById( id, (err, medico) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al editar medico',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el ID ${ id } no existe`,
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( (err, medicoGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al editar medico',
                    errors: err
                });            
            }

            res.status(200).json({
                ok: true,
                usuario: medicoGuardado
            });
        });
    });
});

// Borrar medicos
app.delete('/:id', mdAuth.verificaToken, (req, res, next) => {
    
    const id = req.params.id;

    Medico.findByIdAndDelete( id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });            
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });        
    });
});

module.exports = app;