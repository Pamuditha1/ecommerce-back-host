const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('../envVariables')

const {User} = require('../modules/usersModule')


router.post('/', async (req, res) => {
    
    let user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email.')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) res.status(400).send('Invalid Password.')

    const token = jwt.sign({_id : user._id, type: user.type, name: user.username}, env.jewtKey)
    res.status(200).header('x-auth-token', token).json({
        jwt: token,
        msg: 'Logged In Successfully',
        type: user.type
    });
    return
    
});



module.exports = router;

