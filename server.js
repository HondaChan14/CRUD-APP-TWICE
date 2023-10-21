const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'star-wars-quotes'
var dbCollection

    MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
        dbCollection = db.collection('rappers')
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (request, response)=>{
    dbCollection.find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addAlbum', (request, response) => {
    dbCollection.insertOne({
    coverImage : request.body.coverImage,
    artist: request.body.artist,
    title: request.body.title, likes: 0})
    .then(result => {
        console.log('Rapper Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    dbCollection.updateOne({
        coverImage : request.body.coverImageS, 
        artist: request.body.artistS, 
        title: request.body.titleS,
        likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
        }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
        // response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteAlbum', (request, response) => {
    dbCollection.deleteOne({artist: request.body.artistS})
    .then(result => {
        console.log('Album Deleted')
        response.json('Album Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Listening on port http://localhost:${PORT}`);
})