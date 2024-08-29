import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload = () => {
        this.load.image('cloud1', 'images/scenery/overworld/cloud1.png');
        this.load.image(
            'floor-over',
            'images/scenery/overworld/floorbricks.png'
        );
        this.load.spritesheet('mario', 'images/entities/mario.png', {
            frameWidth: 18,
            frameHeight: 16,
        });
        this.load.spritesheet(
            'mario-grown',
            'images/entities/mario-grown.png',
            {
                frameWidth: 18,
                frameHeight: 32,
            }
        );
        this.load.spritesheet(
            'goomba',
            'images/entities/overworld/goomba.png',
            {
                frameWidth: 16,
                frameHeight: 16,
            }
        );

        this.load.spritesheet('coin', 'images/collectibles/coin.png', {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.image(
            'super-mushroom',
            'images/collectibles/super-mushroom.png'
        );

        this.load.audio('gameover', 'sound/music/gameover.mp3');
        this.load.audio('goomba-stomp', 'sound/effects/goomba-stomp.wav');
        this.load.audio('coin-pickup', 'sound/effects/coin.mp3');
        this.load.audio('powerup', 'sound/effects/consume-powerup.mp3');
        this.load.on('complete', this.initGame);
    };

    initGame = () => {
        this.scene.start('GameScene');
    };
}
