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
    // Below is the logic for creating a character, emitted in CharacterCreation.js
    socket.on("createCharacter", async (character) => {
        try {
            console.log('player is trying to create a character with name: ' + character.name)
            let result = await playerCollection.findOne({ "_id": character.name});    //allows user to provide gameID if that exists, otherwise create a new one for them.
            if (!result) {
                await playerCollection.insertOne(character);
            }
            //socket.join(gameID);
            //socket.activeRoom = gameID; // store active room here so we can use it at our will.
            //No need to insert if character exists
        }
        catch(e) {
            console.error(e)
        }
    });
    socket.on("createLog", async (gameID) => {
        try {
            console.log("Creating new log ", gameID);
            await logCollection.insertOne({"_id": gameID});
        }
        catch(e) {
            console.error(e);
        }
    });
    socket.on("findCharacter", async (gameID) => {
        try {
            console.log('Client is attempting to join a battle scene and needs to find his character... lets find one for them..')
            console.log('findCharacter GameID: ', gameID);
            await new Promise(r => setTimeout(r, 100)); //wait 100ms
            let result = await playerCollection.findOne({"_id": gameID});    //allows user to provide gameID if that exists, otherwise create a new one for them.
            console.log("Found character:", result)
            //socket.join(gameID);
            socket.emit("receiveCharacter", result);
            socket.activeRoom = gameID; // store active room here so we can use it at our will.
            
        } catch (e) {
            console.error(e);
        }
    });
    socket.on("findEnemy", async (enemy) => {
        try {
            console.log("findEnemy: ", enemy);
            let newEnemy = await enemyCollection.findOne({"_id": enemy});
            console.log("Found Enemy: ", newEnemy);
            socket.emit("receiveEnemy", newEnemy);
        }
        catch(e) {
            console.error(e);
        }
    });
    socket.on("battleMessage", (message) => {
        //console.log('active room: ' + socket.activeRoom)
        logCollection.updateOne({ "_id": socket.activeRoom} , {
            "$push": {
                "messages": message
            }    
        });
        //io.to(socket.activeRoom).emit("battleLogUpdate", message); // this might not be necessary, it's mainly to update the chat for the entire chat room, but that's not a feature we're concerned with.
        socket.emit("battleLogUpdate", message);
    });
    socket.on("playerHealthUpdate", (newHP) => {
        playerCollection.updateOne({ "_id": socket.activeRoom} , {
            "$set": {
                "curHP": newHP
            }
        });
        console.log('new player health value updated')
        socket.emit('newPlayerHealth', newHP)
    })
});

express.get("/battlelog/:gameID", async (request, response) => {
    try {
        let result = await logCollection.findOne({"_id": request.params.gameID});  //the _id should match the player's id since the battleLog belongs to that user only
        console.log("result" + result);
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message});
    }
});

// Listens for response from our logCollection on the backend. If the "chat" logCollection in the "test" db doesn't exist, it should make it.
http.listen(PORT, async () => {
    try {
        await client.connect();
        logCollection = client.db("test").collection("Log");
        playerCollection = client.db("test").collection("Player");
        enemyCollection = client.db("test").collection("Enemy");
        console.log("Listenting on port: %s", http.address().port);  //should be listening on port 3000 
    } catch (e) {
        console.error(e)
    }
});