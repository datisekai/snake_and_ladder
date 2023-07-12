import Phaser from "phaser";
import Bootstrap from "./scene/Bootstrap";
import Game from "./scene/Game";
import baseConfig from "./config";
import GameEnd from "./scene/GameEnd";
import Pause from "./scene/Pause";
import Confirm from "./scene/Confirm";
import Help from "./scene/Help";
import Credit from "./scene/Credit";
import Room from "./scene/Room";
import Wait from "./scene/Wait";
import Preload from "./scene/Preload";
import SelectPlayer from "./scene/SelectPlayer";
import Notify from "./scene/Notify";
import Keyboard from "./scene/Keyboard";

const { width, height } = baseConfig;

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: width,
  height: height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [
    Preload,
    Bootstrap,
    Game,
    GameEnd,
    Pause,
    Confirm,
    Help,
    Credit,
    Room,
    SelectPlayer,
    Notify,
    Keyboard,
    Wait,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
};

const game = new Phaser.Game(config);

window.game = game;

export default game;
