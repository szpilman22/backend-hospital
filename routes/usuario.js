
const express = require('express');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

const Usuario = require('../models/usuario');
const mdAuth = require('../middlewares/autenticacion');


// Obtener todos los usuarios
app.get('/', (req, res, next) => {
    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5) // Paginacion - Muestra 5 usuarios en la peticion GET
        .exec((err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });            
        }

        Usuario.count({}, (err, conteo) => {
            res.status(200).json({
                ok:true,
                usuario,
                conteo
            });
        });
    });
});

// Crear Usuario
app.post('/', mdAuth.verificaToken , (req, res, next) => {

    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

// Actualizar usuario
app.put('/:id', mdAuth.verificaToken, (req, res, next) => {

    const id = req.params.id;
    const body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar/actualizar usuario',
                errors: err
            });            
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${ id } no existe`,
                errors: { message: 'No existe un usuario con ese ID' }
            });            
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });            
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// Borrar usuario
app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    const id = req.params.id;

    Usuario.findByIdAndDelete(id , (err, usuarioBorrado) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });            
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;