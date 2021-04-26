class Loss extends Phaser.Scene {
    constructor() {
        super("lossScene");
        console.log("in loss scene constructor...")

        this.socket = io("http://localhost:3000", {
            transports: ["websocket", "polling", "flashsocket"]
        });
    }

    init() {
        this.socket.connect("http://localhost:3000")
        const gameID = localStorage.getItem("gameID")
        this.curPlayer = new Player(gameID);
    }

    preload() {
        //TODO: preload
        this.load.image('lossImg', './assets/playerLost.jpeg');
    }

    create() {
        //console.log(this.curPlayer.name + ' MADE IT TO THE Loss SCENE!!!')
        this.add.image(game.config.width/2, game.config.height/2, 'lossImg')
            .setScale(1.5)
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        this.enterKey.on("down", async event => {
            console.log("Healing player, resetting xp, sending them back to battleScene");
            this.curPlayer.curHP = this.curPlayer.maxHP
            this.curPlayer.exp = 0
            this.socket.emit("playerHealthUpdate", this.curPlayer.maxHP)
            localStorage.setItem("curPlayer", this.curPlayer)
            this.scene.start('battleScene')
        });

    }

    update() {

    }

}