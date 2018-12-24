
const jwt = require('jsonwebtoken');
const seed = require('../config/config').SEED;

// Verificar Token

exports.verificaToken = function (req, res, next) {
    
    var token = req.query.token;
    
    jwt.verify( token, seed, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        
        req.usuario = decoded.usuario;

        next();
    });
};



