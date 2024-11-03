import { Application, Container, Renderer, Sprite, Texture, TilingSprite } from "pixi.js";
import { getIceMeltingAnimation } from "./iceMelting";
import { getIceSparklesAnimation } from "./sparkles";
import { iceCubeEffectDownAnimation } from "./iceCubeEffectDown";
import { coinAnimation } from "./coinAnimation";
import { prizeAnimation } from "./prizeAnimation";
import { generatePrize } from "./generatePrize";
import { DragonI, DragonState } from "../dragon/dragon";
import { playerLost } from "../../../utils/playerLost";

export type OnPrizeOpenT = (options: { type: 'coin' | 'flash', value: number }) => void;

let way: TilingSprite;
let spawnIntervalId: number | undefined;
let isIceCubePresent = false;

const ATTACK_RANGE = 450;
const SPAWN_INTERVAL = 4000;
const DEATH_CHECK_OFFSET = 100;

function logWithTime(message: string) {
    const now = new Date();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    console.log(`[${minutes}:${seconds}] ${message}`);
}

export function addWay(app: Application<Renderer>) {
    const wayTexture = Texture.from('way');
    way = new TilingSprite({ texture: wayTexture, width: app.screen.width, height: app.screen.height / 3 });
    way.y = app.screen.height - way.height;
    app.stage.addChild(way);
    app.ticker.add((delta) => way.tilePosition.x -= delta.deltaTime * 2);
}

export function startIceCubeSpawning(
    app: Application<Renderer>,
    dragon: DragonI,
    onPrizeOpen: OnPrizeOpenT,
    multiplier: number,
    gameState: { isPlaying: boolean },
    handleDeath: () => void
) {
    logWithTime("Starting ice cube spawning");
    spawnIceCube(app, dragon, onPrizeOpen, multiplier, gameState, handleDeath);
    spawnIntervalId = setInterval(() => {
        spawnIceCube(app, dragon, onPrizeOpen, multiplier, gameState, handleDeath);
    }, SPAWN_INTERVAL);
}

export function stopIceSpawning() {
    if (spawnIntervalId !== undefined) clearInterval(spawnIntervalId);
    spawnIntervalId = undefined;
    logWithTime("Stopped ice cube spawning");
}

function spawnIceCube(
    app: Application<Renderer>,
    dragon: DragonI,
    onPrizeOpen: OnPrizeOpenT,
    multiplier: number,
    gameState: { isPlaying: boolean },
    handleDeath: () => void
) {
    isIceCubePresent = true;
    logWithTime("Ice cube spawned");

    const iceContainer = new Container();
    const iceCube = new Sprite(Texture.from('ice_cube'));
    iceCube.width = 100;
    iceCube.height = 100;
    iceCube.anchor.set(0.5);
    iceContainer.x = app.screen.width + iceCube.width / 2;
    iceContainer.y = app.screen.height - way.height + iceCube.height / 2 + 80;
    iceContainer.addChild(iceCube);
    app.stage.addChild(iceContainer);

    let isMelted = false;

    app.ticker.add(function moveIceContainer(delta) {
        iceContainer.x -= delta.deltaTime * 4;

        const deathCheckStart = dragon.getPosition().x + ATTACK_RANGE + DEATH_CHECK_OFFSET;
        if (
            gameState.isPlaying &&
            iceContainer.x < deathCheckStart &&
            iceContainer.x > dragon.getPosition().x + ATTACK_RANGE &&
            playerLost()
        ) {
            handleDeath();
            dragon.setState(DragonState.Dead);
            cleanUpIceContainer(iceContainer, app, moveIceContainer);
            return;
        }

        if (gameState.isPlaying && !isMelted && iceContainer.x <= dragon.getPosition().x + ATTACK_RANGE && iceContainer.x >= dragon.getPosition().x + ATTACK_RANGE - 30) {
            handleIceCubeMelt(app, iceContainer, dragon, onPrizeOpen, multiplier);
            logWithTime("Ice cube melted on attack");
            isMelted = true;
        }

        if (iceContainer.x < -iceContainer.width) {
            logWithTime("Ice cube moved off screen");
            cleanUpIceContainer(iceContainer, app, moveIceContainer);
        }
    });
}

function handleIceCubeMelt(
    app: Application<Renderer>,
    iceContainer: Container,
    dragon: DragonI,
    onPrizeOpen: OnPrizeOpenT,
    multiplier: number
) {
    const onAttack = () => {
        const meltingSprite = getIceMeltingAnimation();
        const sparkles = getIceSparklesAnimation();
        const iceCubeEffectDown = iceCubeEffectDownAnimation();
        iceCubeEffectDown.y -= 10;
        iceCubeEffectDown.x -= 10;
        meltingSprite.width = 240;
        meltingSprite.height = 120;

        iceContainer.removeChildren();
        iceContainer.addChild(meltingSprite, sparkles, iceCubeEffectDown);

        const generatedPrize = generatePrize();
        const prizeEndPosition = generatedPrize.type === 'coin' ? { x: 970, y: 200 } : { x: 970, y: 300 };
        const prizeValue = () => onPrizeOpen({ type: generatedPrize.type, value: generatedPrize.value * multiplier });

        coinAnimation({ app, start: iceContainer.getGlobalPosition(), end: prizeEndPosition, type: generatedPrize.type, callback: prizeValue });
        prizeAnimation({ app, multiplier, prize: generatedPrize.value, startPosition: iceContainer.getGlobalPosition() });
    };

    dragon.attack(onAttack);
}

function cleanUpIceContainer(
    iceContainer: Container,
    app: Application<Renderer>,
    moveIceContainer: (delta: any) => void
) {
    app.stage.removeChild(iceContainer);
    iceContainer.destroy();
    app.ticker.remove(moveIceContainer);
    isIceCubePresent = false;
    logWithTime("Ice cube cleaned up");
}
