import "./style.css";
import { Application, Assets } from 'pixi.js';
import { addBackground } from './components/game/background/addBackground';
import { initDevtools } from '@pixi/devtools';
import { createDragon, DragonState } from "./components/game/dragon/dragon";
import { addWay, OnPrizeOpenT, startIceCubeSpawning, stopIceSpawning } from "./components/game/way/way";
import { destroyCurrentWins, drawCurrentWin } from "./components/balance/drawCurrentWin";
import { cashOutAnimation } from "./components/game/way/cashOutAnimation";
import { addIceBackground } from "./components/game/background/addBackgroundIce";
import { addIce1, addIce2, addIce3 } from "./components/game/background/addSideIceCubes";

type BalanceType = 'coin' | 'flash';

interface Balance {
  coin: number;
  flash: number;
}

const globalBalance: Balance = {
  coin: 100,
  flash: 100,
};

const gameBalance: Balance = {
  coin: 0,
  flash: 0,
}

let multiplier: number = 1;
let betAmount: number = 1;
const gameState = {
  isPlaying: false
}

const resetGameBalance = (app: Application) => {
  gameBalance.coin = 0;
  gameBalance.flash = 0;
  drawCurrentWin(app, 0, 'coin');
  drawCurrentWin(app, 0, 'flash');
  destroyCurrentWins(app);
}

const app = new Application();

const updateGameBalance = (type: BalanceType, qty: number) => {
  gameBalance[type] += qty;
};

async function setup() {
  await app.init({
    background: '#1029bb', width: 1000, height: 800, antialias: false, resolution: window.devicePixelRatio || 1,
  });
  initDevtools({ app })
  app.canvas.style.width = '1000px';
  app.canvas.style.height = '800px';
  const canvas_contaienr = document.getElementById('canvas_container');
  if (canvas_contaienr) {
    canvas_contaienr.appendChild(app.canvas);
  }
}

// stop every animation if user changes the tab -- start

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    app.ticker.stop();
  } else {
    app.ticker.start();
  }
});

// stop everything if user changes the tab -- end

// preload every assets
async function preload() {
  const assets = [
    { alias: 'background_ice', src: '/Asets/Background_Ice.png' },
    { alias: 'background', src: '/Asets/Background.png' },
    { alias: 'way', src: '/Asets/Way.png' },
    { alias: 'ice_cube', src: '/Asets/Ice_Cube.png' },
    { alias: 'ice1', src: '/Asets/Ice_01.png' },
    { alias: 'ice2', src: '/Asets/Ice_02.png' },
    { alias: 'ice3', src: '/Asets/Ice_03.png' },
    { alias: 'dragon_flying', src: '/Dragon_Animation/dragon_flying.png' },
    { alias: 'dragon_death', src: '/Dragon_Animation/dragon_death.png' },
    { alias: 'dragon_attack', src: '/Dragon_Animation/dragon_attack.png' },
    { alias: 'lighting_attack', src: '/VFX/lighting_Attack.png' },
    { alias: 'fire', src: '/VFX/Fire.png' },
    { alias: 'ice_melting', src: '/VFX/Cube.png' },
    { alias: 'sparkles', src: '/VFX/sparkles.png' },
    { alias: 'ice_cube_effect_down', src: '/VFX/Ice_Cube_Effect_Down.png' },
    { alias: 'coin', src: '/Asets/Coin.png' },
    { alias: 'flash', src: 'Asets/Lightning.png' },
    { alias: 'broken_ice_1', src: 'Asets/Ice_Cube_Up_Broken.png'},
    { alias: 'broken_ice_2', src: 'Asets/Ice_Cube_Broken_01.png'},
    { alias: 'broken_ice_3', src: 'Asets/Ice_Cube_Broken_02.png'}
  ];
  await Assets.load(assets);
}



// Asynchronous IIFE
(async () => {
  await setup();
  await preload();
  addBackground(app);
  addIceBackground(app);
  const dragon = createDragon(app);
  addIce1(app);
  addIce3(app);
  addWay(app);
  const coinContainer = document.getElementById('coin');
  const flashContainer = document.getElementById('flash');
  const multiplier_select = document.getElementById('multiplier_select') as HTMLSelectElement;

  if(multiplier_select){
  for (let i = 1; i <= 7; i++) {
    const option = document.createElement("option");
    option.value = i.toString();
    option.text = i.toString();
    multiplier_select.appendChild(option);
  }

  multiplier_select.addEventListener('change', (event) => {
    const selectedValue = parseInt((event.target as HTMLSelectElement).value);
    multiplier = selectedValue;
  });
  }


  const setInitialBalance = () => {
    if (coinContainer && flashContainer) {
      coinContainer.innerHTML = globalBalance.coin.toString();
      flashContainer.innerHTML = globalBalance.flash.toString();
    }
  }
  setInitialBalance();

  const updateGlobalBalance = (options: { type: 'flash' | 'coin', value: number }) => {
    const { type, value } = options;
    globalBalance[type] += value;
    if (!coinContainer || !flashContainer) return;
    if (type === 'coin') {
      coinContainer.innerHTML = globalBalance.coin.toString();
    } else {
      flashContainer.innerHTML = globalBalance.flash.toString();
    }
  }

  const onPrizeOpen: OnPrizeOpenT = (options) => {
    const { type, value } = options;
    updateGameBalance(type, value)
    const gameBalanceValue = type === 'coin' ? gameBalance.coin : gameBalance.flash;
    destroyCurrentWins(app);
    drawCurrentWin(app, gameBalanceValue, type);
  }

  // play btn
  const play_btn = document.getElementById('play_btn');
  if (play_btn) {
    play_btn.innerHTML = gameState.isPlaying ? "cash out" : "play";
  }


  // start playing
  const startPlaying = () => {
    gameState.isPlaying = true;
    startIceCubeSpawning(app, dragon, onPrizeOpen, multiplier, gameState, handleDeath);
    if (play_btn) {
      play_btn.innerHTML = '';
      const cashoutImg = document.createElement('img');
      cashoutImg.src = './Asets/Cash_Out_Botton.png'; // Update the path to your Cash Out image file
      cashoutImg.style.width = '150px';
      play_btn.appendChild(cashoutImg);
    }

    updateGlobalBalance({ type: 'coin', value: -betAmount });
    if(multiplier_select){
      multiplier_select.disabled = true;
    }
  }

  addIce2(app);
// stop playing
const cashOut = (options: { coin: number, flash: number }) => {
  gameState.isPlaying = false;
  const { coin, flash } = options;
  const collectCoins = () => {
      if (coin && coinContainer) {
          globalBalance.coin += coin;
          coinContainer.innerHTML = globalBalance.coin.toString();
      }
  }
  const collectFlash = () => {
      if (flash && flashContainer) {
          globalBalance.flash += flash;
          flashContainer.innerHTML = globalBalance.flash.toString();
      }
  }
  collectCoins();
  collectFlash();

  if (coin) {
      cashOutAnimation({
          app,
          start: { x: 970, y: 200 },
          end: { x: 20, y: app.screen.height },
          type: "coin",
          callback: collectCoins
      });
  }

  if (flash) {
      cashOutAnimation({
          app,
          start: { x: 970, y: 300 },
          end: { x: 30, y: app.screen.height },
          type: "flash",
          callback: collectFlash
      });
  }
  // reset global balance
  resetGameBalance(app);

  // stop playing
  stopIceSpawning();
  if (play_btn) {
      play_btn.innerHTML = 'play'
  }
  if(multiplier_select){
    multiplier_select.disabled = false;
  }
}

  const btnCallback = () => {
    if (gameState.isPlaying) {
      cashOut({ coin: gameBalance.coin, flash: gameBalance.flash })
    } else {
      startPlaying();
    }
  }
  play_btn?.addEventListener('click', btnCallback)

  const handleDeath = () => {
    gameBalance.coin = 0;
    gameBalance.flash = 0;
    destroyCurrentWins(app);
    dragon.setState(DragonState.Dead);
    stopIceSpawning();
    gameState.isPlaying = false;
    multiplier_select.disabled = false;
    if (play_btn) {
      play_btn.innerHTML = 'play'
  }
  }
})();

