import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.spritesheet("player", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("coin", "assets/star.png");
        this.load.image("plains", "assets/plains.png");
        this.load.image("ocean", "assets/ocean.png");
        this.load.image("mountain", "assets/mountains.jpeg");
        this.load.image("cave", "assets/cave.jpeg");
        this.load.image("platform", "assets/platform.png");
    }

    create() {
        this.scene.start("PlainScene");
    }
}
