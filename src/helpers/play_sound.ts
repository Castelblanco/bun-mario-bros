import { Scene, Types } from 'phaser';

export const playSound = (
    scene: Scene,
    key: string,
    cofing?: Types.Sound.SoundConfig | Types.Sound.SoundMarker
) => {
    try {
        scene.sound.play(key, cofing);
    } catch (e) {
        console.log({ e });
    }
};
