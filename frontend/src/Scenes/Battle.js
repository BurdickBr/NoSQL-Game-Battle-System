class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene");
        console.log("in battle scene constructor...");

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

           this.socket.connect("http://localhost:3000")
           
           const gameID = localStorage.getItem("gameID")
           console.log('Battle.js gameID: ' + gameID)           // retrieve gameID from local storage stored on user's browser.
           this.socket.emit('findCharacter', gameID)
           this.socket.on('receiveCharacter', (player) => {
               this.curPlayer = player;
               var playerRecieved = true;
               if( playerRecieved) {
                    console.log('received player information: ' + player)
               }
           });

           
        
        //    this.socket.on("joinBattleScene", async (gameID) => {
        //         console.log("client joined battle scene at gameID: " + gameID)
        //         //this.chat.setText(this.chatMessages);
        //    });
            
        }
        
        update() {
            //TODO: Check battle buttons
            if(curPlayer) {
                console.log('currentPlayer information ' + curPlayer)
            }
        }
    }
    