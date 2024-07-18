import { Math as PMath, Scene, Types } from 'phaser';

export class GameScene extends Scene {
    gameWidth!: number;
    gameHeight!: number;
    controlPlayer!: Types.Input.Keyboard.CursorKeys;
    player!: Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super({ key: 'GameScene' });
    }

    init = () => {
        this.gameWidth = +this.game.config.width;
        this.gameHeight = +this.game.config.height;
    };

    preload = () => {
        this.add.image(100, 200, 'cloud1').setScale(0.5);
        this.player = this.physics.add
            .sprite(100, 400, 'mario')
            .setScale(2)
            .setOrigin(1, 1)
            .setCollideWorldBounds(true)
            .setGravityY(300);

        const floor = this.physics.add.staticGroup();

        floor
            .addMultiple([
                this.add
                    .tileSprite(
                        0,
                        this.gameHeight - 64,
                        this.gameWidth / 5,
                        50,
                        'floor-over'
                    )
                    .setScale(2)
                    .setOrigin(0, 0),
                this.add
                    .tileSprite(
                        500,
                        this.gameHeight - 64,
                        this.gameWidth / 5,
                        50,
                        'floor-over'
                    )
                    .setScale(2)
                    .setOrigin(0, 0),
            ])
            .refresh();

        this.physics.world.setBounds(0, 0, 2000, this.gameHeight);
        this.physics.add.collider(this.player, floor);
        this.cameras.main.setBounds(0, 0, 2000, this.gameHeight);
        this.cameras.main.startFollow(this.player, false, 1, 0);

        this.anims.create({
            key: 'mario-walk',
            frames: this.anims.generateFrameNumbers('mario', {
                start: 3,
                end: 1,
            }),
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'mario-idle',
            frames: [{ key: 'mario', frame: 0 }],
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'mario-jump',
            frames: [{ key: 'mario', frame: 5 }],
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'mario-dead',
            frames: [{ key: 'mario', frame: 4 }],
            frameRate: 9,
            repeat: -1,
        });
        this.controlPlayer = this.input.keyboard!.createCursorKeys();
    };

    update = (time: number, delta: number): void => {
        if (this.player.getData('dead')) {
            if (this.player.y >= this.gameHeight) {
                this.time.delayedCall(8000, () => {
                    this.scene.restart();
                });
            }

            return;
        }

        if (this.controlPlayer.right.isDown) {
            if (this.player.body.touching.down) {
                this.player.anims.play('mario-walk', true);
            }
            this.player.x += 2;
            this.player.flipX = false;
        } else if (this.controlPlayer.left.isDown) {
            if (this.player.body.touching.down) {
                this.player.anims.play('mario-walk', true);
            }
            this.player.x -= 2;
            this.player.flipX = true;
        } else this.player.anims.play('mario-idle', true);

        if (this.controlPlayer.up.isDown) {
            this.player.anims.play('mario-jump', true);
            if (this.player.body.touching.down) this.player.setVelocityY(-430);
        }

        if (this.player.y >= this.gameHeight) {
            this.player.setData('dead', true);
            this.player.anims.play('mario-dead', true);
            this.playerDead();
        }
    };

    playerDead = () => {
        this.player.setGravityY(0.5);
        this.sound.play('gameover', {
            volume: 0.5,
        });
        this.tweens.addMultiple([
            this.add.tween({
                targets: this.player,
                y: {
                    from: this.player.y,
                    to: this.player.y - 200,
                },
                delay: 1000,
                duration: 2000,
                ease: PMath.Easing.Quadratic.InOut,
                onComplete: () => {
                    this.player.setCollideWorldBounds(false);
                },
            }),
        ]);
    };
}
