'use strict';

const passport = require('passport');
const data = require('../../data')();
const config = require('../config');
const stage = process.env.NODE_ENV || 'development';

module.exports = (app, data) => {

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.id);
        }
    });

    passport.deserializeUser((userId, done) => {
        data.getUserById(userId)
            .then(user => {
                done(null, user || false);
            })
            .catch(err => {
                done(err, false);
            });
    });
    require('./local-strategy')(passport, data);
	require('./jwt-strategy')(passport, data, config[stage]);

    app.use(passport.initialize());
    app.use(passport.session());
}