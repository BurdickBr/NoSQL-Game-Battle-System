const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
//const io = require("socket.io")(http);
const io = require("socket.io")(http, {
    cors: {
      origin: "https://example.com",
      methods: ["GET", "POST"]
    }
});
const {MongoClient} = require("mongodb");
const client = new MongoClient("mongodb+srv://FrontEndUser:pass1234@nosqlgamebattlesystem.6mkqb.mongodb.net/NoSQLGameBattleSystem?retryWrites=true&w=majority");

express.use(cors());

var collection;

io.on("connection", (socket) => {
    socket.on("join", async (gameID) => {
        try {
            let result = await collection.findOne({ "_id": gameID});    //allows user to provide gameID if that exists, otherwise create a new one for them.
            if (!result) {
                await collection.insertOne({ "_id":gameID, messages: []});
            }
            socket.join(gameID);
            socket.emit("joined your game session", gameID);
            socket.activeRoom = gameID; // store active room here so we can use it at our will.
        } catch (e) {
            console.error(e);
        }
    });
    socket.on("message", (message) => {
        collection.updateOne({ "_id": socket.activeRoom} , {
            "$push": {
                "messages": message
            }    
        });
        io.to(socket.activeRoom).emit("message", message); // this might not be necessary, it's mainly to update the chat for the entire chat room, but that's not a feature we're concerned with.
    });
});

express.get("/battlelog", async (request, response) => {
    try {
        let result = await collection.findOne({"_id": request.query.room});  //the _id should match the player's id since the battleLog belongs to that user only
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message});
    }
});

http.listen(3000, async () => {
    try {
        await client.connect();
        collection = client.db("nosqlgamebattlesystem").collection("BattleLog");
        console.log("Listenting on port: %s", http.address().port);         //should be listening on port 3000 
    } catch (e) {
        console.error(e)
    }
});