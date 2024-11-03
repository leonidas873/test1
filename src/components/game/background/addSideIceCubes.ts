import { Application, Sprite, Texture, Ticker } from "pixi.js";
import { Assets } from "pixi.js";

export function addIce1(app: Application) {
    const iceTexture = Assets.get('ice1') as Texture;
    const iceSprite = new Sprite(iceTexture);
    iceSprite.width = 150;
    iceSprite.height = (iceTexture.height / iceTexture.width) * 150;
    iceSprite.position.set(app.screen.width + 150, app.screen.height - 200);
    app.stage.addChild(iceSprite);

    app.ticker.add((ticker: Ticker) => {
        const speed = 2 * ticker.deltaTime;
        iceSprite.x -= speed;
        if (iceSprite.x < -150) {
            iceSprite.x = app.screen.width + 150;
        }
    });
}

export function addIce2(app: Application) {
    const iceTexture = Assets.get('ice2') as Texture;
    const iceSprite = new Sprite(iceTexture);
    iceSprite.width = 150;
    iceSprite.height = (iceTexture.height / iceTexture.width) * 150;
    iceSprite.position.set(app.screen.width, app.screen.height-100);
    app.stage.addChild(iceSprite);

    app.ticker.add((ticker: Ticker) => {
        const speed = 5 * ticker.deltaTime;
        iceSprite.x -= speed;
        if (iceSprite.x < -150) {
            iceSprite.x = app.screen.width + 150;
        }
    });
}

export function addIce3(app: Application) {
    const iceTexture = Assets.get('ice3') as Texture;
    const iceSprite = new Sprite(iceTexture);
    iceSprite.width = 150;
    iceSprite.height = (iceTexture.height / iceTexture.width) * 150;
    iceSprite.position.set(app.screen.width + 400, app.screen.height - 180);
    app.stage.addChild(iceSprite);

    app.ticker.add((ticker: Ticker) => {
        const speed = 2 * ticker.deltaTime;
        iceSprite.x -= speed;
        if (iceSprite.x < -150) {
            iceSprite.x = app.screen.width + 150;
        }
    });
}
