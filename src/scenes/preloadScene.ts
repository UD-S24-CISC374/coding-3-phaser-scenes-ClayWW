import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("player", "assets/dude.png");
        this.load.image("coin", "assets/star.png");
        this.load.image("plains", "assets/plains.png");
        this.load.image("ocean", "assets/ocean.png");
        this.load.image("mountain", "assets/mountain.png");
        this.load.image("cave", "assets/cave.png");
        this.load.image("platform", "assets/platform.png");
    }

    create() {
        this.scene.start("PlainScene");
    }
}
