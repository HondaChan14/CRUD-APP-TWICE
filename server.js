const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const PORT = 2121;
require('dotenv').config();

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'star-wars-quotes',
    collectionName = 'rappers';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Wrap the connection code in an async function to use await
async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(dbConnectionStr);
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
        collection = db.collection(collectionName);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Call the async function to connect to the database
connectToDatabase();

app.get('/', async (request, response) => {
    try {
        const data = await collection.find().sort({ likes: -1 }).toArray();
        response.render('index.ejs', { info: data });
    } catch (error) {
        console.error(error);
    }
});

app.post('/addAlbum', async (request, response) => {
    try {
        const { coverImage, artist, title } = request.body;
        const result = await collection.insertOne({ coverImage, artist, title, likes: 0 });
        console.log('Rapper Added');
        response.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.put('/addOneLike', async (request, response) => {
    try {
        const { coverImageS, artistS, titleS, likesS } = request.body;
        const result = await collection.updateOne(
            {
                coverImage: coverImageS,
                artist: artistS,
                title: titleS,
                likes: likesS
            },
            {
                $set: { likes: likesS + 1 }
            }
        );
        console.log('Added One Like');
        response.json('Like Added');
    } catch (error) {
        console.error(error);
    }
});

app.delete('/deleteAlbum', async (request, response) => {
    try {
        const { artistS } = request.body;
        const result = await collection.deleteOne({ artist: artistS });
        console.log('Album Deleted');
        response.json('Album Deleted');
    } catch (error) {
        console.error(error);
    }
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});