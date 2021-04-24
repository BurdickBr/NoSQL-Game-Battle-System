const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
const corsOptions = {
    origin: "http://localhost:5000"
}
const io = require("socket.io")(http, {
    origins:["http://localhost:5000"],
    handlePreflightRequest:(req, res) => {
        res.writeHead(200, {
            "Access-Control-Allow-Origin":"http://localhost:5000",
            "Content-Type": "application/json"
        });
        res.end();
    }
});
const {MongoClient} = require("mongodb");
const client = new MongoClient("mongodb+srv://FrontEndUser:pass1234@nosqlgamebattlesystem.6mkqb.mongodb.net/test?retryWrites=true&w=majority");
const PORT = 3000
express.use(cors());

let logCollection, playerCollection;

// On socket.io connection, do some stuff.
io.on("connection", (socket) => {
    console.log('houston we have a connection')
    // on join, try to find a logCollection matching gameID
    socket.on("join", async (gameID) => {
        try {
            let result = await logCollection.findOne({ "_id": gameID});    //allows user to provide gameID if that exists, otherwise create a new one for them.
            if (!result) {
                await logCollection.insertOne({ "_id":gameID, messages: []});
            }
            socket.join(gameID);
            socket.emit("joined", gameID);
            socket.activeRoom = gameID; // store active room here so we can use it at our will.
            
        } catch (e) {
            console.error(e);
        }
    });
    socket.on("character", async (character) => {
        try {
            let result = await playerCollection.findOne({ "_id": character.name});    //allows user to provide gameID if that exists, otherwise create a new one for them.
            if (!result) {
                await playerCollection.insertOne(character);
            }
            //No need to insert if character exists
        }
        catch(e) {
            console.error(e)
        }
    });
});

express.get("/battlelog/:gameID", async (request, response) => {
    try {
        let result = await logCollection.findOne({"_id": request.params.gameID});  //the _id should match the player's id since the battleLog belongs to that user only
        console.log(result);
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message});
    }
});

// Listens for response from our logCollection on the backend. If the "chat" logCollection in the "test" db doesn't exist, it should make it.
http.listen(PORT, async () => {
    try {
        await client.connect();
        logCollection = client.db("test").collection("chat");
        playerCollection = client.db("test").collection("Player");
        console.log("Listenting on port: %s", http.address().port);  //should be listening on port 3000 
    } catch (e) {
        console.error(e)
    }
});