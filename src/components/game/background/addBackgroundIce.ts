import { Application, Renderer, Texture, TilingSprite } from "pixi.js";

export function addIceBackground(app: Application<Renderer>) {
    const iceBackground = Texture.from('background_ice');
    const tilingSprite = new TilingSprite({
        texture: iceBackground,
        width: app.screen.width,
    });
    tilingSprite.y = 350;
    app.stage.addChild(tilingSprite);

    app.ticker.add(() => {
        tilingSprite.tilePosition.x -= 1;
    });
}