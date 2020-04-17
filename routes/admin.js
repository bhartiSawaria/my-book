
const express = require('express');
const {body} = require('express-validator/check');

const adminControllers = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/admin/books', isAuth, adminControllers.getBooks);
router.get('/profile', isAuth, adminControllers.getProfile);
router.get('/add-book', isAuth, adminControllers.getAddBook);
router.post('/add-book', isAuth, adminControllers.postAddBook);
router.get('/edit-book/:bookId', isAuth, adminControllers.getEditBook);
router.post('/edit-book', isAuth, adminControllers.postEditBook);
router.post('/delete-book', isAuth, adminControllers.postDeleteBook);

module.exports = router;