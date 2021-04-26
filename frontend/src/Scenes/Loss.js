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
        this.leaderBoardButton
    }

    preload() {
        //TODO: preload
        this.load.image('lossImg', './assets/playerLost.jpeg');
        this.load.image('leaderboardButton', './assets/leaderboardButton.png');
    }

    create() {
        //console.log(this.curPlayer.name + ' MADE IT TO THE Loss SCENE!!!')
        // render loss background image
        this.add.image(game.config.width/2, game.config.height/2, 'lossImg')
            .setScale(1.5)
            .setDepth(-1)

        //Button logic for letting user look at leaderboards screen
        this.add.image(game.config.width * 0.5, game.config.height * 0.8, 'leaderboardButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.leaderBoardButton = true;
            });
        
        //enter key logic for sending user back into game with reset stats.
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        this.enterKey.on("down", async event => {
            console.log("Healing player, resetting xp, sending them back to battleScene");
            this.curPlayer.curHP = this.curPlayer.maxHP
            this.curPlayer.exp = 0
            await new Promise(r => setTimeout(r, 100)); //wait 100ms
            this.socket.emit("playerHealthUpdate", this.curPlayer.maxHP)
            localStorage.setItem("curPlayer", this.curPlayer)
            this.scene.start('battleScene')
        });
    }

    update() {
        if(this.leaderBoardButton){
            console.log("exiting loss scene... moving to leaderboards...")
            this.leaderBoardButton = false;
            this.scene.start('leaderboard')
        }
    }

}