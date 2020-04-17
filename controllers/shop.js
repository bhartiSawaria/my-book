
const Book = require('../modals/book');

exports.getIndex = (req, res, next) => {
    Book.find()
    .then(books => {
        let booksArray = [];
        for(let i=0; i<15 && i < books.length; i++){
            booksArray.push(books[i]);
        }
        res.render('shop/index', {
            pageTitle: 'All Books',
            path: '/books',
            books: booksArray,
            searchText: ''
        });
    })
    .catch(err => {
        const error = new Error('Error occured while fetching all books from database.');
        console.log(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getBooks = (req, res, next) => {
    Book.find()
    .then(books => {
        res.render('shop/index', {
            pageTitle: 'All Books',
            path: '/books',
            books: books,
            searchText: ''
        });
    })
    .catch(err => {
        const error = new Error('Error occured while fetching all books from database.');
        console.log(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getBook = (req, res, next) => {
    const id = req.params.bookId;
    Book.findOne({_id: id})
    .populate('userId')
    .exec()
    .then(book => {
        if(!book){
           return res.redirect('/books');
        }
        res.render('shop/book-details', {
            pageTitle: 'Book Details',
            path: '/book-details',
            book: book,
            seller: book.userId
        });
    })
    .catch(err => {
        const error = new Error('Error occured while fetching a book from database.');
        console.log(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getSearch = (req, res, next) => {
    res.render('shop/search', {
        pageTitle: "Search",
        path: '/search'
    });
};

exports.postSearch = (req, res, next) => {
    const searchText = req.body.searchText.split(" ");
    let bookIds = [];
    searchText.forEach(word => {
        Book.find()
        .then(books => {
            if(books){
                books.forEach( book => {
                    const index = book.keywords.findIndex( keyword => {
                        return keyword.toLowerCase() === word.toLowerCase();
                    });
                    if( index >= 0 ){
                            bookIds.push(book._id);
                    }
                })
            };
            return Book.find({_id: {$in : bookIds}});
        })
        .then( books => {
            res.render('shop/index', {
                pageTitle: 'Search book',
                path: '/search',
                books: books,
                searchText: searchText
            });
        })
        .catch(err => {
            const error = new Error('Error occured while searching a book.');
            console.log(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    });
};