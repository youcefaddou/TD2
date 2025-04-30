npm init

creation du fichier server.js

Dans ce fichier:

console.log("coucou");

Dans le terminal (command prompt)

node server.js   

(coucou s'affiche)

Dans le terminal:

npm install express

dans server.js:

const express = require('express'); 
const app = express()
app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Connecté au server sur le port 3000');
    }
});

on test sur le terminal

node server.js

On a bien le message de connexion réussi

dans server.js

app.get('/hello', (req, res) => {
    res.send('Hello World !');
});

on test sur le navigateur en laissant le terminal tourner

localhost:3000

on tape sur le terminal (pour permettre au server de se rafraichir en auto)

npm i nodemon -g

on lance le package en tapant dans le terminal

nodemon server.js 

Ensuite on efface le app.get situé dans le server.js

Dans le terminal, on tape:

npm install mongoose

Dans server.js on déclare:

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mu')

on crée un dossier "models" et dedans ce dossier on crée un fichier "userModel.js". dans ce fichier:

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email : {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    age : {
        type: Number,
        min: 0
    },
    password : {
        type: String,
        required: [true, "Password is required"]
    },
})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;

ensuite on va dans le fichier server.js et on crée un nouvel utilisateur pour tester:

const userModel = require('./models/userModel');

app.use(express.json());

app.post('/users', (req, res) => {
    console.log(req.body);
    
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password
    });
    user.save()
    res.json({
        message: 'User created successfully',
        user: user
    });
})

Ensuite, on va sur Postman, on click sur New HTTP Request, on se met sur POST, on tape http://localhost:3000/users 
On va sur Body ensuite sur raw puis sur JSON en bout de ligne (la ou il y a écrit Text) et dans le champs de texte on tape:

{
    "name" : "tata",
    "email" : "toti@liver.fr",
    "age": 30,
    "password": "totolebg13"
}
On doit obtenir un status: 200 OK ainsi que:

{
    "message": "User created successfully",
    "user": {
        "name": "tata",
        "email": "toti@liver.fr",
        "age": 30,
        "password": "totolebg13",
        "_id": "6811ea0a0db1ab4312337a59"
    }
}

Ensuite on arrange notre code dans server.js pour mettre un try catch et ne pas oublier async et await 

app.post('/users', async (req, res) => {
    try {
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password
        });
        await user.save()      //sauvegarder l'utilisateur dans la base de données
        res.json({
            message: 'User created successfully',
            user: user
        });
    } catch (error) {
        res.json(error.message);
    } 
})

Ensuite on verifie dans postman en supprimant la ligne password: "....." 
et on doit avoir le message: "users validation failed: password: Password is required" avec un statut 200 OK


ensuite dans server.js on va paramétrer le GET: 

app.get('/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json(error.message);
    }
})

on va dans POSTMAN et on teste le GET, on doit obtenir la liste des utilisateurs ajoutés en DB avec un status 200 OK:
[
    {
    "_id": "6811e929cc45a5629ce2fc0f",
        "name": "toto",
        "email": "toto@live.fr",
        "age": 45,
        "password": "totolebg13",
        "__v": 0
    },
    {
        "_id": "6811ea0a0db1ab4312337a59",
        "name": "tata",
        "email": "toti@liver.fr",
        "age": 30,
        "password": "totolebg13",
        "__v": 0
    }
]

Ensuite on crée un dossier routers dans lequel on crée un fichier userRouter.js pour segmenter notre code et le rendre plus facile a lire. On va dans server.js et on coupe le code (Ctrl+X) suivant pour le coller dans userRouter.js et remplacer "app" par "userRouter" :

app.post('/users', async (req, res) => {
    try {
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password
        });
        await user.save()      //sauvegarder l'utilisateur dans la base de données
        res.json({
            message: 'User created successfully',
            user: user
        });
    } catch (error) {
        res.json(error.message);
    } 
})

app.get('/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json(error.message);
    }
})

Tout en haut de ce fichier on va définir les constantes: 

const userRouter = require('express').Router();
const userModel = require('../models/userModel');

Et tout en bas du fichier on doit exporter le module:

module.exports = userRouter;

Ce qui fait que notre userRouter.js ressemble à ceci:

const userRouter = require('express').Router();
const userModel = require('../models/userModel');

userRouter.post('/users', async (req, res) => {
    try {
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password
        });
        await user.save()      //sauvegarder l'utilisateur dans la base de données
        res.json({
            message: 'User created successfully',
            user: user
        });
    } catch (error) {
        res.json(error.message);
    } 
})

userRouter.get('/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json(error.message);
    }
})

module.exports = userRouter;

Pour finir, dans server.js on ajoute sous la ligne ou on a mis "app.use(express.json());" ceci:

app.use(userRouter);

