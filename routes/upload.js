const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

app.use(fileUpload());

app.put("/:tipo/:id", (req, res, next) => {
    
    var tipo = req.params.tipo;
    var id = req.params.id;

// Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf( tipo ) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de colecion no valido",
            errors: {
                message: "Tipo de colecion no valido"
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
        mensaje: "Error al seleccionar archivo",
        errors: {
            message: "Debe seleccionar un archivo"
            }
        });
    }

// Obtener Nombre del Archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split(".");
    var extArchivo = nombreCortado[nombreCortado.length - 1];

// Extensiones validas

    var extValidas = ["jpg", "jpeg", "png", "gif"];

    if (extValidas.indexOf(extArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "Extension no valida",
            errors: {
                message: "Las extensiones validas son" + extValidas.join(", ")
            }
        });
    }

// Nombre de Archivo Personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds}.${extArchivo}`;

    // Mover archivo temporal a un path especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al mover archivo",
                errors: err
            });            
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        
    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    

    if (tipo === 'usuarios') {
            
            Usuario.findById(id, (err, usuario) => {

                if (!usuario) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Usuario no existe',
                        error: {message: 'Usuario no existe'}
                    });
                }

                var pathViejo = '../uploads/usuarios/' + usuario.img;

                // Elimina imagen anterior si es que existe
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                usuario.img = nombreArchivo;

                usuario.save( (err, usuarioActualizado) => {

                    usuarioActualizado.password = ':)';
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen actualizada',
                        usuario: usuarioActualizado
                    });



                });


            });
    }
    

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    error: {message: 'Medico no existe'}
                });
            }

            var pathViejo = '../uploads/medicos/' + medico.img;

            // Elimina imagen anterior si es que existe
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    error: {message: 'Hospital no existe'}
                });
            }

            var pathViejo = '../uploads/hospitales/' + hospital.img;

            // Elimina imagen anterior si es que existe
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado) => {
                
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;
