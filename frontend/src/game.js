// game logic
const phaserConfig = {
    type: Phaser.AUTO,
    parent: "game",
    width: 1860,
    height: 900,
    backgroundColor: "#E28743",
    dom: {
        createContainer: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 200 }
        }
    },
    scene: [CharacterCreation, Battle, Victory, Loss]
}

let game = new Phaser.Game(phaserConfig);