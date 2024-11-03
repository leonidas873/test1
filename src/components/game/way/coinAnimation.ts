import { Application, Sprite, Texture } from "pixi.js";

// Cubic Bezier function for smooth easing
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}

// Separate easing functions for x and y to control trajectory
function applyBezierEaseX(progress: number): number {
    return cubicBezier(progress, 0, 0.4, 0.7, 1);
}

function applyBezierEaseY(progress: number): number {
    return cubicBezier(progress, 0, 0.1, 0.9, 1);
}

// Animation function for a smooth, eased coin animation with scaling effect
interface PositionI {
    x: number;
    y: number;
}

interface CoinAnimationI {
    app: Application;
    start?: PositionI;
    end?: PositionI;
    duration?: number;
    type: 'coin' | 'flash';
    callback?: () => void;
}

export const coinAnimation = ({
    app,
    start = { x: 600, y: 800 },
    end = { x: 1000, y: 200 },
    duration = 500,
    type,
    callback
}: CoinAnimationI) => {
    // Create and configure the coin sprite
    const coinSprite = new Sprite(Texture.from(type));
    coinSprite.width = 30;
    coinSprite.height = 30;
    coinSprite.anchor.set(0.5);
    coinSprite.position.set(start.x, start.y);

    app.stage.addChild(coinSprite);

    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Apply separate easing for x and y to achieve the desired curve
        const easedProgressX = applyBezierEaseX(rawProgress);
        const easedProgressY = applyBezierEaseY(rawProgress);

        // Calculate interpolated position with easing
        coinSprite.x = start.x + (end.x - start.x) * easedProgressX;
        coinSprite.y = start.y + (end.y - start.y) * easedProgressY;

        // Scale: start at 0.02, increase to 0.05 at midpoint, then decrease back to 0.02
        const maxScale = 0.05;
        const minScale = 0.02;
        const scale = rawProgress < 0.5
            ? minScale + (maxScale - minScale) * (rawProgress * 2)  // Scale up in the first half
            : maxScale - (maxScale - minScale) * ((rawProgress - 0.5) * 2); // Scale down in the second half

        coinSprite.scale.set(scale);

        if (rawProgress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Cleanup after animation completes
            app.stage.removeChild(coinSprite);
            coinSprite.destroy();

            // Execute the callback if provided
            if (callback) callback();
        }
    };

    animate();
};
