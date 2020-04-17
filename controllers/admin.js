
const Book = require('../modals/book');

exports.getBooks = (req, res, next) => {
    Book.find({userId: req.user._id})
    .then(books => {
        res.render('admin/books', {
            pageTitle: 'All Books',
            path: '/books',
            books: books,
            sellerName: req.user.name
        });
    })
    .catch(err => {
        const error = new Error('Error occured while fetching all books of a user from database.');
        error.httpStatusCode = 500;
        return next(error);
    }); 
};

exports.getProfile = (req, res, next) => {
    res.render('admin/profile', {
        pageTitle: 'My Profile',
        path: '/profile',
        user: req.user 
    });
};

exports.getAddBook = (req, res, next) => {
    res.render('admin/add-book', {
        pageTitle: 'Add book',
        path: 'admin/add-book',
        isEdit: false
    });
};

exports.postAddBook = (req, res, next) => {
    const title = req.body.title;
    const author = req.body.author;
    const edition = req.body.edition;
    const originalPrice = req.body.originalPrice;
    const expectedPrice = req.body.expectedPrice;
    const imageUrl = req.file.url;
    const description = req.body.description;
    const keywords = title.split(" ");
    keywords.push(...author.split(" "));

    const book = new Book({
        title: title,
        author: author,
        edition: edition,
        originalPrice: originalPrice,
        expectedPrice: expectedPrice,
        imageUrl: imageUrl,
        description: description,
        userId: req.user,
        keywords: keywords
    });
    book.save()
    .then(result => {
        res.redirect('/admin/books');
    })
    .catch(err => {
        const error = new Error('Error occured while adding new book.');
        error.httpStatusCode = 500;
        return next(error);
    })
}; 

exports.getEditBook = (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
    .then(book => {
        if(!book){
            return res.redirect('/admin/books');
        }
        res.render('admin/add-book', {
            pageTitle: "Edit Book",
            path: '/edit-book',
            isEdit: req.query.edit,
            book: book
        });
    })
    .catch(err => {
        const error = new Error('Error occured while editing book.');
        error.httpStatusCode = 500;
        return next(error);
    })
};

exports.postEditBook = (req, res, next) => {
    const bookId = req.body.bookId;
    const keywords = req.body.title.split(" ");
    keywords.push(...req. body.author.split(" "));
    Book.findById(bookId)
    .then(book => {
        book.title = req.body.title;
        book.author = req.body.author;
        book.edition = req.body.edition;
        book.originalPrice = req.body.originalPrice;
        book.expectedPrice = req.body.expectedPrice;
        book.imageUrl = req.file.url;
        book.description = req.body.description;
        book.keywords = keywords;
        return book.save();
    })
    .then(result => {
        res.redirect('/admin/books');
    })
};

exports.postDeleteBook = (req, res, next) => {
    const id = req.body.bookId;
    Book.findByIdAndDelete(id)
    .then(result => {
        res.redirect('/admin/books');
    })
    .catch(err => {
        const error = new Error('Error occured while deleting book.');
        error.httpStatusCode = 500;
        return next(error);
    })
};


