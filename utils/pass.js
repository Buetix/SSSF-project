'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new Strategy(
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({username});
            if(user === null) {
                return done(null, false, {message: 'Incorrect email'});
            }
            const validate = await bcrypt.compare(password, user.password);
            if (!validate) {
                return done(null, false, {message: 'Incorrect password'})
            }
            const strippedUser = user.toObject();
            delete strippedUser.password;
            return done(null, strippedUser, {message: 'Logged in'});
        } catch (e) {
            return new Error(e.message);
        }
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'my_jwt_key',
    },
    async (jwtPayload, done) => {
        try {
            const user = await userModel.findById(jwtPayload._id,
                '-password -__v');
            if (user !== null) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }
        catch (e) {
            return done(null, false);
        }
    },
));

module.exports = passport;