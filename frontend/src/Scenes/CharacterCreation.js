class CharacterCreation extends Phaser.Scene {
    constructor() {
        super("characterCreationScene");
        console.log("CharacterCreation constructor");
        this.socket = io("http://localhost:3000", {
                transports:["websocket","polling","flashsocket"]
            });
        this.battleMessages = [];
        this.charCreated = false;
    }

    preload() {
        this.load.html("form", "form.html");
        this.load.image("tien", "tien.jpg");
    }

    create() {
        this.textInput = this.add.dom(600, 400).createFromCache("form").setOrigin(0.5);
        this.chat = this.add.text(1000, 10, "", {
            lineSpacing: 15,
            backgroundColor: "#dbdad5",
            color: "#26924F",
            padding: 10,
            fontStyle: "bold"
        });
        this.chat.setFixedSize(270, 645);
        this.chat.setDepth(1);
        
        this.spriteGroup = this.physics.add.group({
        defaultKey: "tien",
            maxSize: 15
        })
        
        for (let i = 0; i < 5; i++){
            let randomx = Math.floor(Math.random() * 1000);
            let randomy = Math.floor(Math.random() * 600);
            this.spriteGroup.get(randomx, randomy)
            .setVelocity(100, 200)
            .setBounce(1, 1)
            .setCollideWorldBounds(true)
            .setScale(0.2);
        }
        
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        this.enterKey.on("down", event => {
            console.log("charCreated:", this.charCreated);
            let nameBox = this.textInput.getChildByName("chat");    // this "chat" name needs to match with the form.html file name convention
            if (nameBox.value != "") {
                let newPlayer = new Player(nameBox.value);
                this.socket.emit("character", newPlayer); //TODO: SEND PLAYER OBJECT
                gameID = newPlayer.name;
                //               "join", "gameID" -> gameID should probably match userName.
                this.socket.emit("join", gameID);     
                console.log('connected to ' + gameID)
                localStorage.setItem("gameID", gameID)  // Now that we have gameID, store it in local storage to retrieve in other scenes.
                nameBox.value = "";
                this.charCreated = true;
            }
        });
        
        this.socket.connect("http://localhost:3000")
        console.log(this.socket)
        
        this.socket.on("joined", async (gameID) => {
            console.log("client joined mongoDB at " + gameID)
            let result = await fetch(`http://localhost:3000/battlelog/${gameID}`, {
                "Access-Control-Allow-Origin":"http://localhost:8000",
                "Content-Type": "application/json"
            })
            .then(response => response.json());
            this.battleMessages = result.messages;
            this.battleMessages.push("welcome to " + gameID);
            if(this.battleMessages.length > 20) {
                this.battleMessages.shift();
            }
            
            //this.chat.setText(this.battleMessages);
        });

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
            this.scene.start('battleScene');
        }
    }
}