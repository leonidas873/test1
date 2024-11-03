import { AnimatedSprite, Application, Assets } from "pixi.js";
import { createFramesFromSpriteSheet } from "../../../utils/frameUtils";
import { setDragonProperties } from "./helpers";

export function getDragonFlyAnimation(app:Application): AnimatedSprite {
    const spriteSheetTexture = Assets.get("dragon_flying");
    const frames = createFramesFromSpriteSheet({ spriteSheetTexture, columns: 4, rows: 8, totalFrames: 31 });
    console.log("flying")
    const flySprite = new AnimatedSprite(frames);
    setDragonProperties(app, flySprite)


    return flySprite;
}
