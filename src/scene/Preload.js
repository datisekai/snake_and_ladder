import Phaser from "phaser";
import WebFontFile from "../fonts/WebFontFile";
import {
  LADDER_DEFINITION,
  PLAYER_DEFINITION,
  SNAKE_DEFINITION,
} from "../config/definition";
import config from "../config";

const { width, height } = config;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(510, 290, 320, 50);

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(520, 300, 300 * value, 30);
    });

    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("bg_menu", "assets/bg_menu.jpg");
    this.load.image("but_credit", "assets/but_credits.png");
    this.load.spritesheet("but_fullscreen", "assets/but_fullscreen.png", {
      frameWidth: 60,
      frameHeight: 62,
    });

    this.load.image("logo_menu", "assets/logo_menu.png");
    this.load.image("but_play", "assets/but_play.png");
    this.load.spritesheet("audio", "assets/audio_icon.png", {
      frameWidth: 60,
      frameHeight: 62,
    });
    this.load.addFile(new WebFontFile(this.load, "Permanent Marker"));

    this.load.image("msg_box", "assets/msg_box.png");
    this.load.image("but_exit", "assets/but_exit.png");
    this.load.image("but_yes", "assets/but_yes.png");

    this.load.image("bg_help", "assets/bg_help.png");
    this.load.image("exit", "assets/but_no.png");

    this.load.image("bg_game1", "assets/bg_game1.jpg");
    this.load.image("bg_game0", "assets/bg_game0.jpg");
    this.load.image("but_settings", "assets/but_settings.png");
    this.load.image("turn_panel", "assets/turn_panel.png");

    this.load.image("arrow", "assets/arrow.png");

    this.load.spritesheet("but_dice", "assets/but_dice.png", {
      frameWidth: 84,
      frameHeight: 87,
    });

    this.load.spritesheet("turn", "assets/turns1.png", {
      frameWidth: 44.66,
      frameHeight: 44,
    });

    LADDER_DEFINITION.forEach((item, index) => {
      this.load.image(`ladder_${item.id}`, `assets/ladders/ladder_${item.id}.png`);
    });

    SNAKE_DEFINITION.forEach((item, index) => {
      this.load.spritesheet(
        `snake_${item.id}`,
        `assets/snakes/snake_${item.id}.png`,
        {
          frameWidth: item.width,
          frameHeight: item.height,
        }
      );
    });

    const diceNum = 6;
    for (let i = 1; i <= diceNum; i++) {
      this.load.spritesheet(`dice_${i}`, `assets/dice_${i}.png`, {
        frameWidth: 150,
        frameHeight: 410,
      });
    }

    for (let i = 0; i < PLAYER_DEFINITION.length; i++) {
      this.load.spritesheet(`player_${i}`, `assets/players1/player_${i}.png`, {
        frameWidth: PLAYER_DEFINITION[i].width,
        frameHeight: PLAYER_DEFINITION[i].height,
      });
    }

    this.load.image("msg_box", "assets/msg_box.png");
    this.load.image("but_home", "assets/but_home.png");
    this.load.image("but_restart", "assets/but_restart.png");

    this.load.image("but_help", "assets/but_help.png");
    this.load.image("bg_help", "assets/bg_help.png");
    this.load.image("skip", "assets/but_skip_small.png");
    this.load.image("help_ladder", "assets/help_ladder_sn.png");
    this.load.image("help_snake", "assets/help_snake.png");
    this.load.image("help_player", "assets/help_ladder_anim_ch.png");

    this.load.image("but_no", "assets/but_no.png");

    this.load.image(`but_play_2`, `assets/but_play1/but_play_2.png`);
    this.load.image(`but_play_3`, `assets/but_play1/but_play_3.png`);
  }

  create() {
    this.scene.start("bootstrap");
  }
}
