const express = require('express')
const mongoose = require('mongoose')
const bookRouter = require('./routers/bookRouter')

const app = express()

app.use(express.json())

app.use(bookRouter)

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connecté sur le port 3000');
    }
})

mongoose.connect('mongodb://localhost:27017/TD2')