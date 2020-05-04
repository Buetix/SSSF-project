'use strict';
const userModel = require('../models/userModel');

const bcrypt = require('bcrypt');

const saltRound = 12;

const user_get = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        res.json(user);
    } catch (e) {
        console.error(e.message);
        res.status(500).json({message: e.message});
    }
};

const getUserLogin = async (email) => {
    const user = await userModel.findOne({email: email});
    console.log(user);
    if (user.email === email) {
        return user;
    } else {
        console.log('Not logged in');
    }
};

const create_user = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRound);
    const myUser = await userModel.create({ email: req.body.email, username: req.body.username, password: hash });
    res.json(myUser.id);
};

module.exports = {
    user_get,
    getUserLogin,
    create_user
};