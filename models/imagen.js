const mongoose = require('mongoose');


const ImagenSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    usernameAsociated : String,
    name : String,
    image: String,
    fechaDeGuardado: Number,
    tipoDeModelo:String
}); 

module.exports = mongoose.model('Imagen', ImagenSchema);