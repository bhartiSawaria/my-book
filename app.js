
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const dotenv = require('dotenv');

const User = require('./modals/user');

dotenv.config();

const app = express();

const MONGODB_URI = process.env.MONGODB_URI; 

app.set('view engine', 'ejs');
app.set('views', 'views');

cloudinary.config({
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET
});

const imageStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'images',
    allowedFormats: ['png', 'jpg', 'jpeg'],
    transformation: [{
        width: 600,
        height: 600,
        crop: "limit"
    }]
});

const store = new sessionStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(multer({storage: imageStorage}).single('image'));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialised: false,
    store: store
}));

app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if(!user){
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        const error = new Error('Error occured while finding a user from database.');
        error.httpStatusCode = 500;
        return next(error);
    });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    if(req.user){
        res.locals.username = req.user.name;
    }
    next();
});

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use(shopRoutes);
app.use(adminRoutes);
app.use(authRoutes);

app.use((req, res, next) => {
    res.render('errorPages/404',{
        pageTitle: 'Page not found!!',
        path: 'errorPages/404'
    });
})

app.use((err, req, res, next) => {
    console.log('Reached here');
    console.log(err);
    res.render('errorPages/500', {
        pageTitle: 'Error!!',
        path: 'errorPages/500'
    });
});

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen( process.env.PORT || 3000 );
})
.catch(err => {
    const error = new Error('Error occurred in connecting to mongoose!!');
    console.log(error);
    error.httpStatusCode = 500;
    return next(error);
});