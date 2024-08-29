import { AUTO, Game, Scale } from 'phaser';
import { PreloadScene } from './preload';
import { GameScene } from './scenes/game';

const PRO = import.meta.env.PROD;

export default new Game({
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'app',
    backgroundColor: '#049cd8',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200,
                x: 0,
            },
            debug: !PRO,
        },
    },
    scene: [PreloadScene, GameScene],
});
