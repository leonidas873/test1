import { Application, Sprite, Texture } from "pixi.js";

interface Position {
    x: number;
    y: number;
}

interface CashOutAnimationOptions {
    app: Application;
    start: Position;
    end: Position;
    type?: "coin" | "flash";
    callback?: () => void;
}

export const cashOutAnimation = ({
    app,
    start,
    end,
    type = "coin",
    callback,
}: CashOutAnimationOptions) => {
    const duration = 1000;
    const totalAmount = 20;
    const waveSize = 20;
    const waveDelay = 100;
    let animatedSpritesCount = 0; 

    const animateSprite = (sprite: Sprite, delay: number, onComplete: () => void) => {
        const startTime = Date.now() + delay;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            sprite.x = start.x + (end.x - start.x) * progress;
            sprite.y = start.y + (end.y - start.y) * progress;
            sprite.alpha = 1 - progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                app.stage.removeChild(sprite);
                sprite.destroy();
                onComplete();
            }
        };

        animate();
    };

    const spawnWave = (onWaveComplete: () => void) => {
        const spritesInThisWave = Math.min(waveSize, totalAmount - animatedSpritesCount);

        let completedSprites = 0;

        for (let i = 0; i < spritesInThisWave; i++) {
            const sprite = new Sprite(Texture.from(type === "coin" ? "coin" : "flash"));
            sprite.width = 25;
            sprite.height = 25;
            sprite.anchor.set(0.5);
            sprite.position.set(start.x, start.y);
            app.stage.addChild(sprite);

            const delay = Math.random() * 200;
            animateSprite(sprite, delay, () => {
                completedSprites++;

                if (completedSprites === spritesInThisWave) {
                    onWaveComplete();
                }
            });
        }

        animatedSpritesCount += spritesInThisWave;
    };

    const spawnWaves = () => {
        if (animatedSpritesCount >= totalAmount) {
            if (callback) callback();
            return;
        }

        spawnWave(() => {
            if (animatedSpritesCount < totalAmount) {
                setTimeout(spawnWaves, waveDelay);
            }
        });
    };

    spawnWaves();
};
