const { PlayerCollection, EnemyCollection, ItemCollection, ActionCollection, BattleLogCollection, GameDB } 
  = require('./modules/DBFields')
const { mongoDBUri } = require('./Constants')
const { MongoClient } = require("mongodb");


// Replace the uri string with your MongoDB deployment's connection string.


const client = new MongoClient(mongoDBUri , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    const newMovie = { 
        title: "New Movie Test",
        genres: ["Adventure", "Comedy"],           
    }

    movies.insertOne(newMovie);

    // Query for a movie that has the title 'Back to the Future'
    let query = { title: 'New Movie Test' };
    let movie = await movies.findOne(query);

    console.log(movie);

    let randString = ' more stuff'

    let movieUpdate = {
        $set: {
            title: "New Movie Test 2" + randString
        }
    };

    movies.updateOne(query, movieUpdate);

    query = { title: 'New Movie Test 2' + randString };
    movie = await movies.findOne(query);
    

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);