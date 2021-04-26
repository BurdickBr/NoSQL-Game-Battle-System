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
        //const gameID = localStorage.getItem("gameID")
        //this.curPlayer = localStorage.getItem("curPlayer")
    }

    preload() {
        //TODO: preload
        this.load.image('victoryImg', './assets/victory.jpg');
    }

    create() {
        //console.log(this.curPlayer.name + ' MADE IT TO THE VICTORY SCENE!!!')
        this.add.image(game.config.width/2, game.config.height/2, 'victoryImg')
            .setScale(2)
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
    }

}