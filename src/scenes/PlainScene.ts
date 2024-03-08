import Phaser from "phaser";

export default class PlainScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private coins: Phaser.Physics.Arcade.Group;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: "PlainScene" });
    }

    create() {
        // Adjust the size and position according to your game's design
        this.add.image(400, 300, "plains").setOrigin(0.5, 0.5);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms
            .create(400, 568, "platform")
            .setScale(2)
            .refreshBody(); // Ensure the platform asset is wide enough or scaled

        // Player
        this.player = this.physics.add.sprite(100, 450, "player");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // Physics
        this.physics.add.collider(this.player, this.platforms);

        // Cursors
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Coins setup (similar to stars in your example)
        this.coins = this.physics.add.group({
            key: "coin",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        this.coins.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return true;
        });

        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.overlap(
            this.player,
            this.coins,
            this.collectCoin,
            undefined,
            this
        );

        // Score Text
        this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "32px",
            color: "#000",
        });
    }

    update() {
        if (!this.cursors) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    private collectCoin(
        player:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        coin:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        // Safely cast the coin to the type we expect (Phaser.Physics.Arcade.Image)
        const collectedCoin = coin as Phaser.Physics.Arcade.Image;

        // Disable the coin
        collectedCoin.disableBody(true, true);

        // Update the score
        let score = this.registry.get("coins") || 0;
        this.registry.set("coins", score + 10);
        this.scoreText.setText("Score: " + this.registry.get("coins"));
    }
}
