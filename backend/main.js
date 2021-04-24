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

var collection;

// On socket.io connection, do some stuff.
io.on("connection", (socket) => {
    console.log('houston we have a connection')
    // on join, try to find a collection matching gameID
    socket.on("join", async (gameID) => {
        try {
            let result = await collection.findOne({ "_id": gameID});    //allows user to provide gameID if that exists, otherwise create a new one for them.
            if (!result) {
                await collection.insertOne({ "_id":gameID, messages: []});
            }
            socket.join(gameID);
            socket.emit("joined", gameID);
            socket.activeRoom = gameID; // store active room here so we can use it at our will.
            
        } catch (e) {
            console.error(e);
        }
    });
    socket.on("character", (character) => {
        console.log("character sent:", character);
        collection.updateOne({ "_id": socket.activeRoom} , {
            "$push": {
                "player_name": character.name,
                "max_health": character.maxHP,
                "current_health": character.curHP,
                "damage": character.damage,
                "experience": character.exp,
                "items": character.items
            }    
        });
        io.to(socket.activeRoom).emit("character", character); // this might not be necessary, it's mainly to update the chat for the entire chat room, but that's not a feature we're concerned with.
    });
});

express.get("/battlelog/:gameID", async (request, response) => {
    try {
        let result = await collection.findOne({"_id": request.params.gameID});  //the _id should match the player's id since the battleLog belongs to that user only
        console.log(result);
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message});
    }
});

// Listens for response from our collection on the backend. If the "chat" collection in the "test" db doesn't exist, it should make it.
http.listen(PORT, async () => {
    try {
        await client.connect();
        collection = client.db("test").collection("chat");
        console.log("Listenting on port: %s", http.address().port);  //should be listening on port 3000 
    } catch (e) {
        console.error(e)
    }
});