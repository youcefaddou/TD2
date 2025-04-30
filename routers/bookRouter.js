const bookRouter = require("express").Router()
const bookModel = require('../models/bookModel')

bookRouter.post('/books', async (req, res) => {

    try {
        const book = new bookModel({
            title: req.body.title,
            author: req.body.author,
            publishedDate: req.body.publishedDate,
            genre: req.body.genre
        })
        await book.save()
        res.json({
            message: "Livre crée avec succès !",
            book: book
        })
    } catch (error) {
        res.json(error.message)
    }

})

bookRouter.get('/books', async (req, res) => {
    try {
        const books = await bookModel.find()
        res.json(books)
    } catch (error) {
        res.json(error.message)
    }
})

bookRouter.get('/books/:id', async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id)
        if (!book) { return res.json({ message: 'Livre non trouvé' }) }
        res.json(book)
    } catch (error) {
        res.json(error.message)
    }
})
bookRouter.put('/books/:id', async (req, res) => {
    try {
       await bookModel.updateOne({ _id: req.params.id}, req.body )
        res.json({message: "Livre bien modifié"})
    } catch (error) {
        res.json(error.message)
    }
})
bookRouter.delete('/books/:id', async (req, res) => {
    try {
        await bookModel.deleteOne({_id: req.params.id}, req.body )
        res.json({message: "Livre bien supprimé"})
    } catch (error) {
        res.json(error.message)
    }
})

module.exports = bookRouter

