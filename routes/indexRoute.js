const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res) => {
    try {
        console.log("funcionando mi pana")

        res.json({
            "funcionando":"ok"
        });
    } catch (error) {
        return res.status(400).json({
        mensaje: 'An error has occurred',
        error
        })
    }
});

module.exports = router;