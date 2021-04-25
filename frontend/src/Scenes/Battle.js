class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene");
        console.log("in battle scene constructor...");

        this.socket = io("http://localhost:3000", {
            transports: ["websocket", "polling", "flashsocket"]
        });
    }
    
    init() {
        this.socket.connect("http://localhost:3000")
        this.battleLogMessages = [];
    }


    preload() {
        //TODO: preload
        this.load.image('button', './assets/button.png');
        this.load.image('atkButton', './assets/attackButton.png');
        this.load.image('itemButton', './assets/itemButton.png');
    }
    
    create() {
        /*
        TODO: create buttons, images, display box
        for stats, and battle log.
        Should start by grabbing the current player
        from the Player collection using gameID
        */

        // socket.io connection logic, getting character information setup
        const gameID = localStorage.getItem("gameID")
        console.log('Battle.js gameID: ' + gameID)           // retrieve gameID from local storage stored on user's browser.
        this.socket.emit('findCharacter', gameID)

        this.socket.on('receiveCharacter', (player) => {
            console.log("curPlayer Doc:", player);
            this.curPlayer = Player.docToPlayer(player);
            console.log('curPlayer Obj:', this.curPlayer);
            var playerRecieved = true;
            if (playerRecieved) {
                console.log('received player information: ', player)
                this.battleLog.setText(player.messages)
            }
            
        });
        this.socket.on('battleLogUpdate', (message) => {
            console.log('receieved the following message update from mongoDB: ' + message.msg + '\nUpdating battlelog now...');
            this.battleLogMessages.push(message.time + ': ' + message.msg);
            if(this.battleLogMessages.length > 7) {
                this.battleLogMessages.shift()
            }
            //this.battleLog.setText('battleLog text goes here')
            this.battleLog.setText(this.battleLogMessages)
        });

        //-------------------------------
        //Here starts the UI information|
        //-------------------------------
        var w = game.config.width;
        var h = game.config.height;
        var x = w;
        var y = h;

        // Battle log box
        //                             position of battlelog box
        this.battleLog = this.add.text(20, h * 0.7, "", {
            lineSpacing: 15,
            backgroundColor: "#21313CDD",
            color: "#26924F",
            padding: 10,
            fontStyle: "bold"
        });
        //                          size of battlelog box
        this.battleLog.setFixedSize(w * 0.6, h * 0.25);
        this.battleLog.setDepth(1);                     // bring it to the front of the screen


        this.add.image(x * 0.7, y * 0.2, 'atkButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                let message = new Log(gameID, 'Player performed attack by clicking left button.');
                console.log("attack message: ", message);
                console.log('emitting a message from left button click on this socket: ', this.socket)
                this.socket.emit('battleMessage', message)
                console.log('emitted the battle message, and this left button is sick.')
            })
        
        this.add.image(x * 0.9, y * 0.2, 'itemButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                let message = new Log(gameID, 'Player performed item effect by clicking right button.');
                console.log('emitting a message from left button click on this socket: ', this.socket)
                this.socket.emit('battleMessage', message)
                console.log('emitted the battle message, and this right button is dope.')
            })



        //    this.socket.on("joinBattleScene", async (gameID) => {
        //         console.log("client joined battle scene at gameID: " + gameID)
        //         //this.chat.setText(this.chatMessages);
        //    });

    }

    update() {
        //TODO: Check battle buttons
    }
}
