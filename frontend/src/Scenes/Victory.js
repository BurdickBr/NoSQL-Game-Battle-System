class Victory extends Phaser.Scene {
    constructor() {
        super("victoryScene");
        console.log("in victory scene constructor...")

        this.socket = io("http://localhost:3000", {
            transports: ["websocket", "polling", "flashsocket"]
        });
    }

    init() {
        this.socket.connect("http://localhost:3000")
        this.backToBattle = false;
        //this.xpInfoBox = false;
        //const gameID = localStorage.getItem("gameID")
        //this.curPlayer = localStorage.getItem("curPlayer")
    }

    preload() {
        //TODO: preload
        this.load.image('victoryImg', './assets/victory.jpg');
        this.load.image('continueButton', './assets/continueButton.png')
    }

    create() {
        this.add.image(game.config.width/2, game.config.height/2, 'victoryImg')
            .setScale(3)
            .setDepth(-1)
        
        // Continue button drawing and logic
        this.add.image(game.config.width * 0.8, game.config.height * 0.3, 'continueButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                console.log()
                this.backToBattle = true;
            });

        // Enter key can also continue and send player back to battle scene.
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterKey.on("down", async event => {
            console.log("Sending player back to battleScene");
            //localStorage.setItem("curPlayer",this.curPlayer)
            this.backToBattle = true;
        });
        
    }

    update() {
        if(this.backToBattle) {
            this.scene.start('battleScene');
        }
        // if(!this.xpInfoBox) {
        //     let earnedXP = localStorage.getItem("xpEarned")
        //     this.xpInfoTextbox.setText('You earned: ' + earnedXP + "\n New XP Total: " + this.curPlayer.exp)
        // }
    }

}