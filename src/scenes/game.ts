import { Physics, Math, Scene, Types, Animations } from 'phaser';
import { MarioPlayer } from '../game_objects/mario';
import { playSound } from '../helpers/play_sound';

export class GameScene extends Scene {
    gameWidth!: number;
    gameHeight!: number;
    playerVel!: number;
    controlPlayer!: Types.Input.Keyboard.CursorKeys;
    player!: MarioPlayer;
    enemy!: Types.Physics.Arcade.SpriteWithDynamicBody;
    coins!: Physics.Arcade.StaticGroup;

    constructor() {
        super({ key: 'GameScene' });

        this.playerVel = 5;
    }

    init = () => {
        this.gameWidth = +this.game.config.width;
        this.gameHeight = +this.game.config.height;

        this.anims.create({
            key: 'mario-idle',
            frames: [{ key: 'mario', frame: 0 }],
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'mario-grown-idle',
            frames: [{ key: 'mario-grown', frame: 0 }],
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'mario-collect-super-mushroom',
            frames: [
                { key: 'mario', frame: 0 },
                { key: 'mario-grown', frame: 0 },
            ],
            frameRate: 12,
            repeat: 4,
        });

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
            key: 'mario-grown-walk',
            frames: this.anims.generateFrameNumbers('mario-grown', {
                start: 3,
                end: 1,
            }),
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
            key: 'mario-grown-jump',
            frames: [{ key: 'mario-grown', frame: 5 }],
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'mario-dead',
            frames: [{ key: 'mario', frame: 4 }],
            frameRate: 9,
            repeat: -1,
        });

        this.anims.create({
            key: 'goomba-walk',
            frames: this.anims.generateFrameNumbers('goomba', {
                start: 0,
                end: 1,
            }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: 'goomba-dead',
            frames: [{ key: 'goomba', frame: 2 }],
            frameRate: 12,
            repeat: 1,
        });

        this.anims.create({
            key: 'coin-idle',
            frames: this.anims.generateFrameNumbers('coin', {
                start: 0,
                end: 3,
            }),
            frameRate: 9,
            repeat: -1,
        });
    };

    preload = () => {
        this.add.image(100, 200, 'cloud1').setScale(0.5);
        this.player = new MarioPlayer(this, 100, 400);

        this.enemy = this.physics.add
            .sprite(200, 500, 'goomba')
            .setScale(2)
            .setGravityY(400)
            .setVelocityX(-50);

        this.coins = this.physics.add.staticGroup();

        this.coins
            .addMultiple([
                this.coins.create(200, 400, 'coin').setScale(2),
                this.coins.create(300, 400, 'coin').setScale(2),
            ])
            .playAnimation('coin-idle');

        const superMushroom = this.physics.add
            .sprite(200, 200, 'super-mushroom')
            .setGravityY(400)
            .setScale(2);

        this.enemy.anims.play('goomba-walk', true);
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

        this.physics.add.collider(this.player, floor);
        this.physics.add.collider(this.enemy, floor);
        this.physics.add.collider(superMushroom, floor);
        this.physics.add.collider(
            this.player,
            this.enemy,
            this.onHitEnemy as any
        );
        this.physics.add.overlap(
            this.player,
            this.coins,
            this.onCollectCoin as any
        );
        this.physics.add.overlap(
            this.player,
            superMushroom,
            this.onCollectSuperMushroom as any
        );

        this.physics.world.setBounds(0, 0, 2000, this.gameHeight);
        this.cameras.main.setBounds(0, 0, 2000, this.gameHeight);
        this.cameras.main.startFollow(this.player, false, 1, 0);

        this.controlPlayer = this.input.keyboard!.createCursorKeys();
    };

    update = (_: number, delta: number): void => {
        if (this.player.getData('dead')) {
            if (this.player.y >= this.gameHeight) {
                this.time.delayedCall(8000, () => {
                    this.scene.restart();
                });
            }

            return;
        }

        this.player.move(delta);
    };

    onHitEnemy = (
        mario: MarioPlayer,
        enemy: Types.Physics.Arcade.SpriteWithDynamicBody
    ) => {
        if (mario.body?.touching.down && enemy.body.touching.up) {
            enemy.setVelocityX(0);
            playSound(this, 'goomba-stomp');
            enemy.anims.play('goomba-dead');
            mario.jump(-230);

            enemy.on(Animations.Events.ANIMATION_COMPLETE, () => {
                enemy.destroy(true);
            });

            this.addScore(mario.x, mario.y, '500');
            return;
        }
        this.player.dead();
    };

    onCollectCoin = (
        mario: MarioPlayer,
        coin: Types.Physics.Arcade.SpriteWithStaticBody
    ) => {
        playSound(this, 'coin-pickup', {
            volume: 0.2,
        });
        coin.destroy();
        this.addScore(mario.x, mario.y, '200');
    };

    onCollectSuperMushroom = (
        mario: MarioPlayer,
        mushroom: Types.Physics.Arcade.SpriteWithDynamicBody
    ) => {
        this.physics.world.pause();
        mario.setData('block', true);
        mario.anims.play('mario-collect-super-mushroom');
        mario.setData('type', 'grown');
        mushroom.destroy();
        playSound(this, 'powerup', {
            volume: 0.2,
        });

        mario.on(Animations.Events.ANIMATION_COMPLETE, () => {
            this.physics.world.resume();
            mario.setData('block', false);
            mario.setDisplaySize(18, 32).setScale(2).body?.setSize(18, 32);
        });
    };

    addScore = (x: number, y: number, scoreTxt: string) => {
        const score = this.add.text(x + 10, y - 50, scoreTxt, {
            fontFamily: 'pixel',
        });
        this.add.tween({
            targets: score,
            duration: 500,
            y: score.y - 50,
            onComplete: () => score.destroy(true),
        });
    };
}
