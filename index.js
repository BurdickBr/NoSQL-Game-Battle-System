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

    const database = client.db(GameDB);
    const playerCollection = database.collection(PlayerCollection.COLLECTION);

    const newPlayer = {
      name: "Chuck",
      level: 5
    }

    await playerCollection.insertOne(newPlayer);

    let query = { name: 'Chuck' };
    let plyr = await playerCollection.findOne(query);

    console.log("Player Name:", plyr.name);

    let plyrUpdate = {
        $set: {
            name: "Better Chuck"
        }
    };
    query = { name: 'Better Chuck' };
    await playerCollection.updateOne(query, plyrUpdate);
    let newPlyr = await playerCollection.findOne(query)
    

    console.log("New Player Name:", newPlyr.name);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);