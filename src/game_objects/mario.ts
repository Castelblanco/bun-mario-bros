import { Physics, Types } from 'phaser';
import { GameScene } from '../scenes/game';
import { playSound } from '../helpers/play_sound';

type TAnims = {
    idle: string;
    walk: string;
    jump: string;
};

const ANIMATIONS: Record<string, TAnims> = {
    grown: {
        idle: 'mario-grown-idle',
        walk: 'mario-grown-walk',
        jump: 'mario-grown-jump',
    },
    normal: {
        idle: 'mario-idle',
        walk: 'mario-walk',
        jump: 'mario-jump',
    },
};

export class MarioPlayer extends Physics.Arcade.Sprite {
    controllers: Types.Input.Keyboard.CursorKeys;
    scene: GameScene;
    vel: number;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'mario');

        scene.physics.world.enableBody(this);
        this.setScale(2)
            .setOrigin(1, 1)
            .setCollideWorldBounds(true)
            .setGravityY(450);

        this.scene = scene;
        this.vel = 10;
        this.controllers = this.scene.input.keyboard!.createCursorKeys();
        this.setData('type', 'normal');

        scene.add.existing(this);
    }

    move = (delta: number) => {
        if (this.getData('dead')) return;
        if (this.getData('block')) return;
        const type = this.getData('type');

        if (this.controllers.right.isDown) {
            if (this.body?.touching.down) {
                this.anims.play(ANIMATIONS[type].walk, true);
            }
            this.setVelocityX(this.vel * delta);
            this.flipX = false;
        } else if (this.controllers.left.isDown) {
            if (this.body?.touching.down) {
                this.anims.play(ANIMATIONS[type].walk, true);
            }
            this.setVelocityX(-(this.vel * delta));
            this.flipX = true;
        } else {
            this.setVelocityX(0);
            this.anims.play(ANIMATIONS[type].idle, true);
        }

        if (this.controllers.up.isDown) this.jump();

        if (this.y >= this.scene.gameHeight) this.dead();
    };

    jump = (velY?: number) => {
        this.anims.play(ANIMATIONS[this.getData('type')].jump, true);
        if (this.body?.touching.down) {
            this.setVelocityY(velY || -430);
        }
    };

    dead = () => {
        if (this.getData('dead')) return;

        if (this.body) this.body.checkCollision.none = true;
        this.setData('dead', true);
        this.anims.play('mario-dead', true);
        this.setVelocity(0);
        playSound(this.scene, 'gameover', {
            volume: 0.5,
        });
        this.setCollideWorldBounds(false);
        this.setVelocityY(-400);
    };
}
