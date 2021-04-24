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
        
        this.enterKey.on("down", async event => {
            console.log("ENTER KEY PRESSED!! Character name is being entered... need to emit this information to socket...");
            let nameBox = this.textInput.getChildByName("chat");    // this "chat" name needs to match with the form.html file name convention
            if (nameBox.value != "") {
                let newPlayer = new Player(nameBox.value);
                await this.socket.emit("createCharacter", newPlayer); //TODO: SEND PLAYER OBJECT   
                gameID = newPlayer.name;
                console.log('connected to ' + gameID)
                localStorage.setItem("gameID", gameID)  // Now that we have gameID, store it in local storage to retrieve in other scenes.
                nameBox.value = "";
                this.charCreated = true;
            }
        });
        
        this.socket.connect("http://localhost:3000")
        //console.log(this.socket)
        
        // received characterCreated message from server with gameID, now we have the character id
        console.log("character created... Character ID: " + gameID)

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
            this.scene.start('battleScene');
        }
    }
}