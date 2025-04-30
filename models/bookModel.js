const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type : String,
        required: [true, "Le titre est requis"]
    },
    author: {
        type: String,
        required: [true, "L'auteur est requis"]
    },
    publishedDate: {
        type: Date,
        required: [true, "La date est requise"]
    },
    genre: {
        type: String,
        required: [true, "Un genre est requis"]
    }
})

const bookModel = mongoose.model('books', bookSchema)

module.exports = bookModel 