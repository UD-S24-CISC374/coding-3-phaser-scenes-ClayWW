import Phaser from "phaser";

export default class MountainScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private coins: Phaser.Physics.Arcade.Group;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private winText: Phaser.GameObjects.Text | null = null;

    constructor() {
        super({ key: "CaveScene" });
    }

    create() {
        // Ocean background
        this.add.image(400, 300, "cave").setOrigin(0.5, 0.5).setScale(2.5);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        const gameWidth = this.scale.width;
        const platformOriginalWidth = 400;
        const scale = gameWidth / platformOriginalWidth + 10;

        this.platforms
            .create(400, this.scale.height - 32, "platform")
            .setScale(scale, 1)
            .refreshBody();

        // Player
        this.player = this.physics.add.sprite(100, 450, "player");
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Player animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {
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

        // Retrieve score from previous scene
        this.score = this.registry.get("coins") || 0;

        // Coins
        const numCoins = Math.floor(this.scale.width / 70) - 1;
        this.coins = this.physics.add.group({
            key: "coin",
            repeat: numCoins,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        this.coins.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return true;
        });

        // Coin collection and collisions
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.overlap(
            this.player,
            this.coins,
            this.collectCoin,
            undefined,
            this
        );

        // Score text
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: "32px",
            color: "#000",
        });

        this.winText = this.add
            .text(this.scale.width / 2, this.scale.height / 2, "You Win!", {
                fontSize: "64px",
                color: "#fff",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setVisible(false);
    }

    update() {
        const speed = 160;
        const jumpVelocity = -330;

        if (this.cursors?.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("left", true);
        } else if (this.cursors?.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors?.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(jumpVelocity);
        }

        if (this.winText && this.winText.visible) {
            return; // Skip the update logic if the win text is visible
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
        const collectedCoin = coin as Phaser.Physics.Arcade.Image;
        collectedCoin.disableBody(true, true);

        this.score += 10;
        this.registry.set("coins", this.score);
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.coins.countActive(true) === 0) {
            // Show the win text and stop the player
            if (this.winText) {
                this.winText.setVisible(true);
            }
            this.player.setVelocity(0);
            this.player.anims.stop();
        }
    }
}
