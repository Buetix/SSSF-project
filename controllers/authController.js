"use strict";
const jwt = require("jsonwebtoken");
const passport = require("passport");

const login = (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: "Something went wrong",
                user: user
            });
        }
        req.login(user, { session: false }, err => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(user, 'my_jwt_key');
            return res.json({ user, token });
        });
    })(req, res);
};

module.exports = {
    login
};