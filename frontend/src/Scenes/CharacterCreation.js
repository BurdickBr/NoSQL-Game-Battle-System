class CharacterCreation extends Phaser.Scene {
    constructor() {
        super("characterCreationScene");
        console.log("CharacterCreation constructor");
        this.socket = io("http://localhost:3000", {
                transports:["websocket","polling","flashsocket"]
            });
        this.battleMessages = [];
        this.charCreated = false;
        this.leaderBoardButton = false;
    }

    preload() {
        this.load.html("form", "form.html");
        this.load.image("tien", "./assets/tien.png");
        this.load.image("roshiBackground", './assets/MainMenuImage.png');
        this.load.image('leaderboardButton', './assets/leaderboardButton.png');
    }
    
    create() {
        // connect to the socket.io socket
        this.socket.connect("http://localhost:3000")
        
        /*
        Graphics section
        */

        // Background image
        this.add.image(game.config.width / 2, game.config.height / 2, 'roshiBackground').setDepth(-1).setScale(.62);
        
        
        // Bouncing tiens
        this.spriteGroup = this.physics.add.group({
            defaultKey: "tien",
            maxSize: 15
        })
        
        //Generate however many of them.
        for (let i = 0; i < 5; i++){
            let randomx = Math.floor(Math.random() * 1000);
            let randomy = Math.floor(Math.random() * 600);
            this.spriteGroup.get(randomx, randomy)
            .setVelocity(100, 200)
            .setBounce(1, 1)
            .setCollideWorldBounds(true)
            .setScale(0.2);
        }
        
        // Text input box and textbox logic
        this.textInput = this.add.dom(game.config.width * 0.5, game.config.height * 0.7).createFromCache("form").setOrigin(0.5);
        
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterKey.on("down", async event => {
            console.log("ENTER KEY PRESSED!! Character name is being entered... need to emit this information to socket...");
            let nameBox = this.textInput.getChildByName("chat");    // this "chat" name needs to match with the form.html file name convention
            if (nameBox.value != "") {
                let newPlayer = new Player(nameBox.value);
                await this.socket.emit("createCharacter", newPlayer); 
                gameID = newPlayer.name;
                await this.socket.emit("createLog", gameID);
                console.log('connected to ' + gameID)
                localStorage.setItem("gameID", gameID)  // Now that we have gameID, store it in local storage to retrieve in other scenes.
                nameBox.value = "";
                console.log("character created... Character ID: " + gameID)
                this.charCreated = true;
            }
        });
        
        // Leaderboard button creation and logic.
        this.add.image(game.config.width * 0.5, game.config.height * 0.8, 'leaderboardButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.leaderBoardButton = true;
            });


        // received characterCreated message from server with gameID, now we have the character id
        this.socket.on("message", (message) => {
            this.battleMessages.push(message);
            if (this.battleMessages.length > 20) {
                this.battleMessages.shift();
            }
            this.chat.setText(this.battleMessages);
        });
    }

    update() {
        if (this.charCreated) {
            console.log("exiting character creation scene... moving to battleScene...")
            this.charCreated = false;
            this.scene.start('battleScene');
        }
        if(this.leaderBoardButton){
            console.log("exiting character creation scene... moving to leaderboards...")
            this.leaderBoardButton = false;
            this.scene.start('leaderboard')
        }
    }
}