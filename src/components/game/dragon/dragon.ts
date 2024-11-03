import { Application, AnimatedSprite } from "pixi.js";
import { getDragonFlyAnimation } from "./dragonFly";
import { getDragonAttackAnimation } from "./dragonAttack";
import { getDragonDeathAnimation } from "./dragonDeath";
import { getFireAnimation } from "./fireEffect";

export enum DragonState {
    Flying = "flying",
    Dead = "dead",
    Attack = "attack",
}

export interface DragonI {
    setState: (newState: DragonState, attackCallBack?: () => void) => void;
    getPosition: () => { x: number; y: number };
    attack: (attackCallBack: () => void) => void;
}

export function createDragon(app: Application):DragonI {
    let state: DragonState = DragonState.Flying;
    let sprite: AnimatedSprite = getDragonFlyAnimation(app);
    let fireEffect: AnimatedSprite | null = null;

    app.stage.addChild(sprite);

    function setState(newState: DragonState, attackCallBack?: () => void) {
        if (newState !== state) {
            app.stage.removeChild(sprite);
            state = newState;

            switch (state) {
                case DragonState.Attack:
                    sprite = getDragonAttackAnimation(app);
                    sprite.loop = false;

                    sprite.onFrameChange = () => {
                        if (sprite.currentFrame === 15 && !fireEffect) {
                            fireEffect = getFireAnimation();
                            fireEffect.position.set(sprite.x + 175, sprite.y + 150);
                            fireEffect.rotation = Math.PI / 4;
                            app.stage.addChild(fireEffect);
                            fireEffect.play();
                            if(attackCallBack){

                                attackCallBack();
                            }
                        }
                    };

                    sprite.onComplete = () => {
                        setState(DragonState.Flying);
                        fireEffect?.destroy();
                        fireEffect = null;
                    };

                    sprite.play();
                    break;
                case DragonState.Dead:
                    sprite = getDragonDeathAnimation(app);
                    sprite.onComplete = () => {
                        setState(DragonState.Flying);
                        console.log("hello")
                    };
                    break;
                default:
                    sprite = getDragonFlyAnimation(app);
                    break;
            }

            app.stage.addChild(sprite);
        }
    }

    // attack

    function attack(attackCallBack:()=>void){
        setState(DragonState.Attack, attackCallBack);
    }

    return {
        setState,
        getPosition: () => ({ x: sprite.x, y: sprite.y }),
        attack
    };
}
