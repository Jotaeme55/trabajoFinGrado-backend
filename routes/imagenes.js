const axios = require('axios');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const Imagen = require('../models/imagen');

router.get('/:username', async(req, res) => {
    console.log(req.query)
    const username = req.params.username;
    const pagina = req.query.pagina;
    const ordenar = req.query.ordenar;
    const tipoDeModelo = req.query.tipoDeModelo;
    const buscador = !(req.query.buscador) ? '': req.query.buscador;
    try {
        let imagenesDB = {}
        imagenesDB = await Imagen.find({"tipoDeModelo":tipoDeModelo,"usernameAsociated":username,"name": {$regex : buscador, $options:"i"}}).skip(9*pagina).limit(9)
        var total =  await Imagen.countDocuments({"nombre": {$regex : buscador}});
        if(ordenar){
            imagenesDB = await Imagen.find({"tipoDeModelo":tipoDeModelo,"usernameAsociated":username,"name": {$regex : buscador, $options:"i"}}).sort({[ordenar[0]]:ordenar[1]}).skip(9*pagina).limit(9)
        }
        res.json({
            imagenesDB,
            total
        });
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

router.post('/', async(req, res) => {
    const body = req.body; 
    try {
        body._id = new mongoose.Types.ObjectId();
        console.log("Posting a new image")
        const imagenDB = await Imagen.create(body);
        res.status(200).json(imagenDB); 
    } catch (error) {
        console.log("Error::", error)
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

module.exports = router;