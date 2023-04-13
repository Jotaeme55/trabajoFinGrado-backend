const axios = require('axios');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { header ,body, param, validationResult } = require('express-validator');
const JwtToken = require("../models/jwtToken");
require('dotenv').config()
const jwt = require('jsonwebtoken');


const palabra_secreta_jwt = process.env.VUE_APP_SECRET_WORD_JWT


router.get('/:email',
    param('email').isEmail(),
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const email = req.params.email;

        try {
            const userDB = await User.findOne({"email": email});
            console.log(userDB)
            if (userDB!=null && userDB.password!=null){
                res.status(200).json("already exists");
            }else{
                res.status(200).json()
            }
            
        } catch (error) {
            return res.status(400).json({
                mensaje: 'An error has occurred',
                error
            });
        }
    }
);

router.post('/', async(req, res) => {
    const body = req.body;  
    try {
    body._id = new mongoose.Types.ObjectId();
    console.log("Posting a new user")
    const userDB = await User.create(body);
    res.status(200).json(userDB); 
    } catch (error) {
        console.log("Error::", error)
    return res.status(500).json({
        mensaje: 'An error has occurred',
        error
    })
    }
});


///////
router.delete('/:id', async (req, res) => {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado o inválido' });
    }
    
    let token;
    if(req.headers.authorization.indexOf('Bearer ') !== -1 && req.headers.authorization.indexOf('Basic ') !== -1){
        token = req.headers.authorization.split(' ')[1].slice(0, -1);
    }else if(req.headers.authorization.indexOf('Bearer ') !== -1 && req.headers.authorization.indexOf('Basic ') === -1){
        token = req.headers.authorization.split(' ')[1];
    }

    // // Validar si se proporciona el parámetro de ID del usuario
    if (!req.params.id) {
      return res.status(400).json({ message: 'ID del usuario no proporcionado' });
    }
  
    // Obtener el ID del usuario
    const userID = req.params.id;
    try{
        let tokenDB = await JwtToken.findOne({user_id_asociated:userID})
        jwt.verify(token, palabra_secreta_jwt, async (err, decoded) => {
            
            if (err) {
                console.log(err)
                res.status(501).json({ message: 'El token proporcionado no es el mismo' +err});
            } else {
                if(tokenDB.code!=decoded.code){
                    res.status(501).json({ message: 'El token proporcionado no es el mismo' });
                }else{
                    // Lógica de eliminación del usuario usando el método deleteUser
                    try {
                      const result = await User.findByIdAndDelete(userID)
                      res.status(200).json(result);
                    } catch (error) {
                      console.error(error);
                      res.status(500).json({ message: 'Error al eliminar el usuario' });
                    }
                }
            }
          });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al extraer el token de la base de datos' });
    }
    
  });
  

module.exports = router;