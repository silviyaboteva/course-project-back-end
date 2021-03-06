'use strict';
const jwt = require('jsonwebtoken');
const constants = require('../utilities/constants');
const encryptor = require('../utilities/encryptor');

module.exports = ({ data, passport }) => {
    return {
        register(req, res) {
            const body = req.body;
            const user = {
                username: req.body.username,
                passHash: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                image: 'http://www.bathspa.ac.uk/media/WebProfilePictures/default_profile.jpg',
                email: req.body.email,
                cartMeals: [],
                addresses: [],
                orders: []
            };
            console.log('register contr ' + user.username);
            data.createUser(user)
                .then(() => {
                    res.json({ message: 'Registration successfull' });
                })
                .catch(error => {
                    console.log(error);
                    res.status(400).json({ error:{ message: 'Registration failed!' }});
                });
        },
        loginLocal(req, res, next) {
            const username = req.body.username;
            const password = req.body.password;

            data.getUserByUsername(username)
                .then(user => {
                    if (!user) {
                        res.status(401).json({error: { message: "Wrong username or password" }});
                    }

                    const passHash = encryptor.getPassHash(user.salt, password);

                    if (user.passHash === passHash) {
                        console.log('final stage');
                        const payload = { id: user._id };
                        console.log(payload);
                        const token = jwt.sign(payload, constants.secret, {
                            expiresIn: 1008000000 // in seconds
                        });
                        console.log(token);
                        res.json({message:'Login successful', success: true, user: { username: user.username, token: 'JWT '+token } });
                    } else {
                        res.status(401).json({error: { message: "Wrong username or password" }});
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ error:{message:'Wrong username or password' }});
                })

        },
        logout(req, res) {
            req.logout();
            res.status(202).json({
                succes: true,
                message: `User ${req.body.username} is logged out succesfully`
            });
        },
        getLoggedUser(req, res) {
            const token = req.headers.authorization;
            if (token) {
                let decoded = jwt.decode(token.split(' ')[1], 'james bond 007');

                const userInfo = decoded._doc;
                let user = {
                    username: userInfo.username
                };

                res.status(200).json(user);
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Please provide token'
                });
            }
        }
    }
}