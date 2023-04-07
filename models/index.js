const mongoose = require('mongoose');

const indexSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    usernameAsociated : String,
    index:[]
}); 

module.exports = mongoose.model('Imagen', indexSchema);