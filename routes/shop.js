
const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/books', isAuth, shopController.getBooks);
router.get('/book-details/:bookId', isAuth, shopController.getBook);
router.get('/search', isAuth, shopController.getSearch);
router.post('/search', isAuth, shopController.postSearch);

module.exports = router;