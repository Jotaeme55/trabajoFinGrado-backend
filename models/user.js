const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sexEnum = {
    values: ["Masculino", "Femenino"],
    message: '{VALUE} no es un sexo valido'
}

const userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    email: String,
    telefono: Number,
}); 

module.exports = mongoose.model('User', userSchema);