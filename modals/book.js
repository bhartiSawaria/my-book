
const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    edition: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    expectedPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true            
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    keywords: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model('Book', bookSchema);