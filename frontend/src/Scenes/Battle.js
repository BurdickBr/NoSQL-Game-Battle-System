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
        this.enemies = ["MeanMan", "ReallyMeanMan"];
        this.playerTurn = true;
        this.curPlayer = null;
    }


    preload() {
        //TODO: preload
        this.load.image('button', './assets/button.png');
        this.load.image('atkButton', './assets/attackButton.png');
        this.load.image('itemButton', './assets/itemButton.png');
        this.load.image('SaibaMan', './assets/Saibamen.png');
        this.load.image('Raditz', './assets/Raditz.png');
        this.load.image('Nappa', './assets/Nappa.png');
        this.load.image('Vegeta', './assets/Vegeta.png');
        this.load.image('player', './assets/goku_cropped.png')
    }
    
    create() {
        // socket.io connection logic, getting character information setup
        const gameID = localStorage.getItem("gameID")
        console.log('Battle.js gameID: ' + gameID)           // retrieve gameID from local storage stored on user's browser.

        /*
            Socket Emits
        */
        this.socket.emit('findCharacter', gameID)
        this.socket.emit('findEnemy', this.enemies[0]);

        /*
            Sockets listening on
        */
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
        this.socket.on('receiveEnemy', (enemy) => {
            console.log("enemy Doc: ", enemy);
            this.curEnemy = new Enemy(enemy);
            console.log("curEnemy: ", this.curEnemy)
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
        // this is a message intended to recieve new HP value from backend after it's updated in mongoDB
        // this.socket.on("newPlayerHP", (newHP) => {
        //     console.log('playerHP changed...')
        //     this.player.curHP = newHP;
        // });

        //-------------------------------
        //Here starts the UI information|
        //-------------------------------
        var w = game.config.width;
        var h = game.config.height;
        var x = w;
        var y = h;

        // Battle log box
        //                             position of battlelog box
        
        let playerHealthBar = this.makeBar(w * 0.7,h * 0.4,0x2ecc71);
        this.setValue(playerHealthBar, 100)
        let enemyHealthBar = this.makeBar(140,100,0xe74c4c);
        this.setValue(enemyHealthBar, 100)
        
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
                this.atkFlag = true;
            });
        
        this.add.image(x * 0.9, y * 0.2, 'itemButton')
            .setScale(0.2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                let message = new Log(gameID, 'Player performed item effect by clicking right button.');
                console.log('emitting a message from left button click on this socket: ', this.socket)
                this.socket.emit('battleMessage', message)
                console.log('emitted the battle message, and this right button is dope.')
                this.itemFlag = true;
            })
        this.add.image(x*0.8, y*0.8, 'player')

    }

    makeBar(x, y, color) {
        let bar = this.add.graphics();
        bar.fillStyle(color, 1);
        bar.fillRect(0, 0, 250, 30);
        bar.x = x;
        bar.y = y;
        return bar;
    }
    setValue(bar, percentage) {
        bar.scaleX = percentage/100;
    }

    update() {

        
        /*
        Battle Logic
        */
       if (this.playerTurn) {
           if(this.atkFlag) {
               let plyrDmg = this.curPlayer.doAttack();
               this.curEnemy.adjustHP(plyrDmg * (-1));
               let battleMessage = new Log(gameID,
                this.curPlayer.name + ' attacks ' + this.curEnemy.name
                + ' for ' + plyrDmg + ' damage!');
                this.socket.emit("battleMessage", battleMessage);
                this.atkFlag = false;
                this.playerTurn = false;
            }
            else if(this.itemFlag) {
                if(!this.curPlayer.useItem()) {
                    this.itemFlag = false;
                    this.socket.emit("battleMessage", 
                    new Log(gameID, this.curPlayer.name + ' has no more items!'));
                }
                else {
                    this.socket.emit("battleMessage",
                    new Log(gameID, this.curPlayer.name + ' used an item to heal!'));
                    this.itemFlag = false;
                    this.playerTurn = false;
                }
            }
        }
        // Enemy Turn
        else {
            let enemDmg = this.curEnemy.doAttack();
            this.curPlayer.adjustHP(enemDmg * (-1));
            
            // Update battlelog to reflect changes
            let message = new Log(gameID, 
                this.curEnemy.name + ' attacks ' + this.curPlayer.name 
                + ' for ' + enemDmg + ' damage!');
                this.socket.emit("battleMessage", message);
                
                //Update player's health in mongoDB
                //console.log('current player hp: ' + this.curPlayer.curHP)
                this.socket.emit('playerHealthUpdate', this.curPlayer.curHP)
                this.playerTurn = true;
            }
            /*
                Check if Player or Enemy is defeated
            */
           if(this.curPlayer != null) {
               if(this.curPlayer.isDead) {
                   localStorage.setItem("curPlayer", this.curPlayer)
                   this.scene.start('lossScene')
                   //TODO: Player loses screen
                   //console.log("Player loses");
               }
               if(this.curEnemy.isDead) {
                   localStorage.setItem("curPlayer", this.curPlayer)
                   this.scene.start('victoryScene')
                   //TODO: Player wins screen
                   //console.log("Player wins");
               }
           }
            
        }
    }
    