class Leaderboard extends Phaser.Scene {
    constructor() {
        super("leaderboard");
        console.log("in leaderboard scene constructor...")

        this.socket = io("http://localhost:3000", {
            transports: ["websocket", "polling", "flashsocket"]
        });
    }

    init() {
        this.socket.connect("http://localhost:3000")
        const gameID = localStorage.getItem("gameID")
        this.curPlayer = new Player(gameID);
        this.characterCreationButton = false;
        this.nameLeaderBoardLineOne = 'NAME:'
        this.expLeaderBoardLineOne = 'EXP:'
        this.leaderBoardLineTwo = '---------------------'
        this.nameLeaderBoardValues = []
        this.expLeaderBoardValues = []
    }

    preload() {
        this.load.image('leaderboardBackground', './assets/leaderboard.png');
        this.load.image('characterCreationButton', './assets/characterCreationButton.png');
    }

    create() {
        //background image
        this.add.image(game.config.width / 2, game.config.height / 2, 'leaderboardBackground');

        this.add.image(game.config.width * 0.5, game.config.height * 0.9, 'characterCreationButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.characterCreationButton = true;
            });
        
        //Draw the name leaderboard box
        this.nameLeaderBoard = this.add.text(game.config.width * 0.1, game.config.height * 0.1, "", {
            lineSpacing: 25,
            backgroundColor: "#CCCCCCDD",
            color: "#ffff00",
            padding: 10,
            fontStyle: "bold",
            fontSize:60
        });
        this.nameLeaderBoard.setFixedSize(game.config.width * 0.4, game.config.height * 0.7);
        this.nameLeaderBoard.setDepth(1)
        
        //Draw the expLeaderBoardBox
        this.expLeaderBoard = this.add.text(game.config.width * 0.5, game.config.height * 0.1, "", {
            lineSpacing: 25,
            backgroundColor: "#CCCCCCDD",
            color: "#ffff00",
            padding: 10,
            fontStyle: "bold",
            fontSize:60
        });
        this.expLeaderBoard.setFixedSize(game.config.width * 0.4, game.config.height * 0.7);
        this.expLeaderBoard.setDepth(1);  
        
        //Get the leaderboard information and add it to the leaderboard box.
        this.socket.emit('getLeaderboards')
        this.socket.on('sendLeaderboards', (top5) => {
            this.nameLeaderBoardValues = [this.nameLeaderBoardLineOne, this.leaderBoardLineTwo];
            this.expLeaderBoardValues = [this.expLeaderBoardLineOne, this.leaderBoardLineTwo]
            for(var i = 0; i < 5; i++){
                this.nameLeaderBoardValues.push(top5[i].name)
                this.expLeaderBoardValues.push(top5[i].hiExp)
            }
            this.nameLeaderBoard.setText(this.nameLeaderBoardValues)
            this.expLeaderBoard.setText(this.expLeaderBoardValues)
        })


    }

    update() {
        if(this.characterCreationButton && (this.curPlayer != null))
        {
            console.log("exiting leaderboard scene... moving to characterCreation scene...")
            this.characterCreationButton = false;
            this.curPlayer = null;
            localStorage.setItem('gameID', null)
            this.scene.start('characterCreationScene')
        }

    }

}