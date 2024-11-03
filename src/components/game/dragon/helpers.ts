import { AnimatedSprite, Application } from "pixi.js";

export const setDragonProperties = (app:Application, sprite:AnimatedSprite) => {
    sprite.animationSpeed = 0.7;
    sprite.anchor.set(0.5);
    sprite.play();
    
    sprite.x = app.screen.width / 4 - 100;
    sprite.y = app.screen.height / 2 + 50;
    sprite.scale.set(0.15);

}