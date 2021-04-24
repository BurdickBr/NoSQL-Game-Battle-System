class CharacterCreation extends Phaser.Scene {
    constructor() {
        super("characterCreationScene");
        console.log("CharacterCreation constructor");
        this.socket = io("http://localhost:3000", {
                transports:["websocket","polling","flashsocket"]
            });
        this.chatMessages = [];
        this.charCreated = false;
        this.gameID = null;
    }

    preload() {
        this.load.html("form", "form.html");
        this.load.image("image", "image.jpg");
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
        defaultKey: "image",
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
            let chatbox = this.textInput.getChildByName("chat");    // this "chat" name needs to match with the form.html file name convention
            if (chatbox.value != "") {
                let newPlayer = new Player(chatbox.value);
                this.socket.emit("character", newPlayer); //TODO: SEND PLAYER OBJECT
                this.gameID = newPlayer.name;
                this.socket.emit("join", this.gameID);     
                console.log('connected to ' + this.gameID)
                chatbox.value = "";
                this.charCreated = true;
            }
        });
        this.socket.connect("http://localhost:3000")
        console.log(this.socket)
        //               "join", "gameID" -> gameID should probably match userName.
        
        this.socket.on("joined", async (gameID) => {
            console.log("client joined mongoDB at " + gameID)
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

        this.socket.on("message", (message) => {
            this.chatMessages.push(message);
            if (this.chatMessages.length > 20) {
                this.chatMessages.shift();
            }
            this.chat.setText(this.chatMessages);
        });
    }

    update() {
        if (this.charCreated) {
            this.scene.start('battleScene');
        }
    }
}