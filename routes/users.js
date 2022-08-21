const axios = require('axios');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const imagen = require('../models/imagen');

router.get('/', async(req, res) => {
    try {
        let userDB = {}
        userDB = await User.find()
        res.json(userDB);
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

 router.get('/:username', async(req, res) => {
 const username = req.params.username;
     try {
         const userDB = await User.findOne({"username": username});
         res.json(userDB);
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

router.put('/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;  
    try {
        console.log("Updating a user")
        console.log("User ID: ", _id)
        console.log("Body: ", req.body)
        const userDB = await User.findByIdAndUpdate(_id, body);
        res.status(200).json(userDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'An error has occurred',
            error
        })
    }
});

router.delete('/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        console.log(_id)
        const username = await User.findById(_id)
        console.log("username",username)
        await imagen.deleteMany({usernameAsociated: {$eq : username.username}})
        const userDB = await User.findByIdAndDelete(_id);
        res.status(200).json(userDB);
    } catch (error) {
        console.log("Error::", error)
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error',
            error
        })
    }
});

module.exports = router;