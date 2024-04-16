// import from '../css/style.css';

import Phaser from "phaser";
import Preloader from "./scenes/Preloader.ts";
import Game from "./scenes/Game.ts";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  parent: "game",
  scene: [Preloader, Game],
});
