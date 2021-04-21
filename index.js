const { PlayerCollection, EnemyCollection, ItemCollection, ActionCollection, BattleLogCollection, GAME_DB } 
  = require('./modules/DBFields')
const { mongoDBUri } = require('./Constants')
const { MongoClient } = require("mongodb");

const client = new MongoClient(mongoDBUri , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db(GAME_DB);
    const playerCollection = database.collection(PlayerCollection.COLLECTION);

    const newPlayer = {
      name: "Chuck",
      level: 5
    }

    //await playerCollection.insertOne(newPlayer);

    let query = { name: 'Chuck' };
    let plyr = await playerCollection.findOne(query);

    console.log("Player ID:", plyr);

    let plyrUpdate = {
        $set: {
            name: "Better Chuck"
        }
    };
    await playerCollection.updateOne(query, plyrUpdate);

    query = { name: 'Better Chuck'}

    let newPlyr = await playerCollection.findOne(query)
    

    console.log("New Player ID:", newPlyr);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);