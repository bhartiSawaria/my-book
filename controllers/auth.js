
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator/check');

const User = require('../modals/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:  process.env.NODEMAILER_TRANSPORTER_API_KEY
    }
}));

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: 'auth/signup',
        validationErrors: [],
        oldData: {
            name: '',
            contactNo: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });
};

exports.postSignUp = (req, res, next) => {
    const name = req.body.name;
    const contactNo = req.body.contactNo;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign Up',
            path: 'auth/signup',
            validationErrors: errors.array(),
            oldData: {
                name: name,
                contactNo: contactNo,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        });
    }

    bcrypt.hash(password, 12)
    .then(hashPassword => {
        const user = new User({
            name: name,
            contactNo: contactNo,
            email: email,
            password: hashPassword
        });
        return user.save();
    })
    .then(result => {
        return transporter.sendMail({
            to: email,
            from: 'myBook@test.com',
            subject: 'Sign Up succedded',
            html: '<h1>Sign Up to myShop succedded!!</h1>'
        })
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        const error = new Error('Error occured while signing up.');
        error.httpStatusCode = 500;
        return next(error);
    }); 
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        validationErrors: [],
        oldData: {
            email: '',
            password: ''
        }
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            validationErrors: errors.array(),
            oldData: {
                email: email,
                password: password
            }
        });
    }
    User.findOne({email: email})
    .then(user => {
        if(!user){
            throw new Error('User not found');
        }
        req.session.user = user;
        req.session.isLoggedIn  = true;
        req.session.save( err => {
            if(err){
                console.log(err);
            }
            res.redirect('/books');
        })
    })
    .catch(err => {
        const error = new Error('Error occured while signing up.');
        error.httpStatusCode = 500;
        return next(error);
    });;
 
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};