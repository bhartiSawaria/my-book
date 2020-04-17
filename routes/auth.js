
const express = require('express');
const bcrypt = require('bcryptjs');
const {body} = require('express-validator/check');

const authControllers = require('../controllers/auth');
const User = require('../modals/user');
const isAuth = require('../middlewares/isAuth');
const isNotAuth = require('../middlewares/isNotAuth');

const router = express.Router();

router.get('/signup', isNotAuth, authControllers.getSignUp);

router.post('/signup', isNotAuth,
    [
        body('email')
        .isEmail().withMessage('Email is invalid.')
        .custom((value, {req}) => {
            return User.findOne({email:value}).then(user => {
                if(user){
                    return Promise.reject('Email already exist.');
                }
            })
        }),

        body('password')
        .isLength({min:6})
        .withMessage('Password must be 6 characters long.'),

        body('confirmPassword')
        .custom((value, {req}) => {
            if(!(value === req.body.password)){
                throw new Error('Passwords do not match.');
            }
            return true;
        }),

        body('contactNo')
        .isLength({min:10, max:10})
        .withMessage('Invalid phone number')
    ],
    authControllers.postSignUp);

router.get('/login', isNotAuth, authControllers.getLogin);

router.post('/login', isNotAuth,
    [
        body('email')
        .custom((value, {req}) => {
            return User.findOne({email: value}).then(user => {
                if(!user){
                    return Promise.reject('Email not registered.');
                }
            })
        }),

        body('password')
        .custom((value, {req}) => {
            return User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    return bcrypt.compare(value, user.password)
                    .then(isEqual => {
                        if(!isEqual){
                            return Promise.reject('Password is incorrect.');
                        }
                    })
                }
            })
            
        })
    ],
    authControllers.postLogin);

router.post('/logout', isAuth, authControllers.postLogout);

module.exports = router;