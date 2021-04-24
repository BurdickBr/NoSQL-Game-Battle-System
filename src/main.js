// game logic
const phaserConfig = {
    type: Phaser.AUTO,
    parent: "game",
    width: 1280,
    height: 720,
    backgroundColor: "#E7F6EF",
    dom: {
        createContainer: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 200 }
        }
    },
    scene: [CharacterCreation]
}

let game = new Phaser.Game(phaserConfig);