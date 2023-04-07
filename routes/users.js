const axios = require('axios');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, param, validationResult } = require('express-validator');

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

router.delete('/:id', async(req, res) => {
    const _id = req.params.id;
    try {
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