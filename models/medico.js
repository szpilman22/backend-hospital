const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicoSchema = ({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [ true, 'El ID hospital es un campo obligatorio' ] }

});

module.exports = mongoose.model('Medico', medicoSchema);