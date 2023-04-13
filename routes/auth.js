const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Mongoose = require('mongoose');
const google = require('googleapis');
const axios = require("axios")
const ConfirmationCode = require("../models/confirmationCode");
const JwtToken = require("../models/jwtToken");
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { body, param, validationResult } = require('express-validator');
const palabra_secreta_aes = process.env.VUE_APP_SECRET_WORD_AES
const palabra_secreta_jwt = process.env.VUE_APP_SECRET_WORD_JWT



///////////////////////////////////////////////////////

router.post('/google', async (req, res) => {
    const { code } = req.body;
    const oauth2Client = new google.google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.FRONTEND_URI
      );

    try {
        let { tokens } = await oauth2Client.getToken(code);
        let accessToken = tokens.access_token;
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    
        if (!data.verified_email) {
            return res.status(403).json({ error: 'Google account not verified' });
        }
    
        const { email } = data;
        const options = { upsert: true, runValidators: false, new: true, lean: true };
        const user = await User.findOneAndUpdate({ email }, { email }, options);
        const userId = user._id;
        const aleatorio = Math.floor(Math.random() * Math.pow(10, 6)).toString().padStart(6, '0');
        await JwtToken.findOneAndUpdate({ user_id_asociated: userId }, { code: aleatorio }, { upsert: true });
    
        const token = jwt.sign({ code:aleatorio }, palabra_secreta_jwt);
        const message = { userId, token, email };
        const mensajeJson = JSON.stringify(message);
        const mensajeCifrado = CryptoJS.AES.encrypt(mensajeJson, palabra_secreta_aes).toString();
    
        res.status(200).json(mensajeCifrado);
    } catch (err) {

        res.status(500).json({ error: err.message });
    }
  });

///////////////////////////////////////////////////////

router.post("/login", async (req, res) => {
    passport.authenticate("local", async (err, user, info) => {
    try {
        if (err) {
            return res.status(400).json({ errors: err });
        }
        if (!user) {
            return res.status(400).json(info);
        }
  
        let userId = user._id;
        let aleatorio = Math.floor(Math.random() * Math.pow(10, 6)).toString().padStart(6, '0');
        await JwtToken.findOneAndUpdate({ user_id_asociated: userId }, { code: aleatorio }, { upsert: true });
  
        let token = jwt.sign({ code:aleatorio }, palabra_secreta_jwt);

        let message = { userId, token };
        let mensajeJson = JSON.stringify(message);

        let mensajeCifrado = CryptoJS.AES.encrypt(mensajeJson, palabra_secreta_aes).toString();
  
        res.status(200).json(mensajeCifrado);
    } catch (error) {
            return res.status(400).json({ errors: error });
    }
    })(req, res);
  });

///////////////////////////////////////////////////////

router.post("/register/:code", [
    param('code').not().isEmpty(),
    param('code').isLength(6),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],async (req, res) => {
    let { body, params } = req;
    let { code } = params;
    
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    let hasError = false;
    
    if (!body.password) {
        errors.password = { msg: 'The password field cannot be blank' };
        hasError = true;
    }
    
    if (!body.email) {
        errors.email = { msg: 'The email field cannot be blank' };
        hasError = true;
    } else {
        let duplicatedUser = await User.findOne({ email: body.email });
        if (duplicatedUser && duplicatedUser.password!=null) {
            errors.email = { msg: 'This email is already in use' };
            hasError = true;
        }
    }
    
    let confirmationCode = await ConfirmationCode.findOne({ email: body.email });
    if (!confirmationCode || confirmationCode.code !== parseInt(code)) {
        return res.status(400).json({ msg: 'The confirmation code is invalid or expired' });
    }
    
    if (hasError) {
        return res.status(400).json({ errors });
    }

    try {
        body.password = bcrypt.hashSync(body.password, 10);
        const userToFind = await User.findOneAndUpdate({"email": body.email},{ ...body });
        let userDB;
        let userId;
        if(userToFind!=null){
            userId = userToFind._id
            userDB =userToFind
        }else{
            userId = new Mongoose.Types.ObjectId();
            userDB = await User.create({ ...body, _id: userId });
        }
        
        let aleatorio = Math.floor(Math.random() * Math.pow(10, 6)).toString().padStart(6, '0');
        await JwtToken.findOneAndUpdate({ user_id_asociated: userId }, { code: aleatorio }, { upsert: true });
    
        let token = jwt.sign({ code:aleatorio }, palabra_secreta_jwt);
        
        let message = { userId, token };
        let mensajeJson = JSON.stringify(message);
        let mensajeCifrado = CryptoJS.AES.encrypt(mensajeJson, palabra_secreta_aes).toString();
        return res.status(200).json(mensajeCifrado);
    } catch (err) {

        return res.status(500).json({ message: err.message });
    }
});

///////////////////////////////////////////////////////

router.post('/logout', function(req, res, next){
    req.session.destroy()
    res.status(401);
});

module.exports = router;