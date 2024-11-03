import { Application, Renderer, Sprite } from "pixi.js";

export function addBackground(app: Application<Renderer>) {
    const background = Sprite.from('background');
    background.width = app.screen.width;
    background.height = app.screen.height;
    background.x = 0;
    background.y = 0;
    app.stage.addChild(background);
}
