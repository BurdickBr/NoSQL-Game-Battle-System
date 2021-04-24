class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene");
        console.log("battleScene");

        this.socket = io("http://localhost:3000", {
                transports:["websocket","polling","flashsocket"]
            });
        
        }
        
        preload() {
            //TODO: preload
        }
        
        create () {
            /*
            TODO: create buttons, images, display box
            for stats, and battle log.
            Should start by grabbing the current player
            from the Player collection using gameID
            */
           //let curPlayer = playerCollection.findOne(gameID);
           const gameID = localStorage.getItem("gameID")
           this.socket.connect("http://localhost:3000")
           console.log('Battle.js gameID: ' + gameID)           // retrieve gameID from local storage stored on user's browser.
           
           this.socket.on("joined", async (gameID) => {
               console.log("client joined battle.js at " + gameID)
               let result = await fetch(`http://localhost:3000/battlelog/${gameID}`, {
                   "Access-Control-Allow-Origin":"http://localhost:8000",
                   "Content-Type": "application/json"
                })
                .then(response => response.json());
                this.chatMessages = result.messages;
                this.chatMessages.push("welcome to " + gameID);
                if(this.chatMessages.length > 20) {
                    this.chatMessages.shift();
                }
                
                //this.chat.setText(this.chatMessages);
            });
            
        }
        
        update() {
            //TODO: Check battle buttons
        }
    }
    