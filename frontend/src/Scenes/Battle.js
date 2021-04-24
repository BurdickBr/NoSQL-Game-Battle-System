class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene");
        console.log("battleScene");

        this.socket = io("http://localhost:3000", {
                transports:["websocket","polling","flashsocket"]
            });
    }

    

    update() {
        //TODO: Check battle buttons
    }
}