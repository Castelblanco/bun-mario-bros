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

        this.load.audio('gameover', 'sound/music/gameover.mp3');
        this.load.on('complete', this.initGame);
    };

    initGame = () => {
        this.scene.start('GameScene');
    };
}
