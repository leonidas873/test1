import { Application, Container, Sprite, Text, TextStyle, Texture, Graphics } from "pixi.js";

let coinBalanceContainer: Container | null = null;
let flashBalanceContainer: Container | null = null;

export const drawCurrentWin = (app: Application, currentBalance: number, type: 'coin' | 'flash') => {
    if (type === 'coin') {
        drawCurrentBalance(app, currentBalance, 'coin', app.screen.height / 4, coinBalanceContainer);
    } else {
        drawCurrentBalance(app, currentBalance, 'flash', app.screen.height / 4 + 100, flashBalanceContainer);
    }
};

const drawCurrentBalance = (
    app: Application,
    currentBalance: number,
    iconTextureAlias: string,
    positionY: number,
    balanceContainerRef: Container | null
) => {
    if (balanceContainerRef) {
        app.stage.removeChild(balanceContainerRef);
        balanceContainerRef.destroy({ children: true });
    }

    const balanceContainer = new Container();
    balanceContainer.x = app.screen.width - 100;
    balanceContainer.y = positionY;

    const background = new Graphics();
    background.roundRect(0, -25, 100, 50, 15);
    background.fill({color:'black', alpha: 0.2});


    const iconTexture = Texture.from(iconTextureAlias);
    const iconSprite = new Sprite(iconTexture);
    iconSprite.anchor.set(0.5);
    iconSprite.width = 30;
    iconSprite.height = 30;
    iconSprite.x = 70;
    iconSprite.y = 0;

    const textStyle = new TextStyle({
        fontFamily: 'Keons',
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#000000',
    });

    const balanceText = new Text({text:currentBalance.toString(), style:textStyle});
    balanceText.x = 5;
    balanceText.y = -15;

    balanceContainer.addChild(background);
    balanceContainer.addChild(iconSprite);
    balanceContainer.addChild(balanceText);

    app.stage.addChild(balanceContainer);

    if (iconTextureAlias === 'coin') {
        coinBalanceContainer = balanceContainer;
    } else if (iconTextureAlias === 'flash') {
        flashBalanceContainer = balanceContainer;
    }
};

// Function to destroy current wins
export const destroyCurrentWins = (app: Application) => {
    if (coinBalanceContainer) {
        app.stage.removeChild(coinBalanceContainer);
        coinBalanceContainer.destroy({ children: true });
        coinBalanceContainer = null;
    }

    if (flashBalanceContainer) {
        app.stage.removeChild(flashBalanceContainer);
        flashBalanceContainer.destroy({ children: true });
        flashBalanceContainer = null;
    }
};
