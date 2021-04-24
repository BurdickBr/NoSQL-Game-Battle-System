class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene");
        console.log("battleScene");

        this.socket = io("http://localhost:3000", {
                transports:["websocket","polling","flashsocket"]
            });
    }

    preload() {
        //TODO: preload
    }

    create () {
        /*
            TODO: create buttons, images, display box
            for stats, and battle log
        */
    }

    update() {
        //TODO: Check battle buttons
    }
}