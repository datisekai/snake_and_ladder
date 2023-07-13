import Phaser from "phaser";
import Server from "../services/server";
import config from "../config";
import Button from "../game-object/Button";
import WebFontFile from "../fonts/WebFontFile";

const { width, height } = config;

export default class Bootstrap extends Phaser.Scene {
  constructor() {
    super("bootstrap");
  }

  init() {
    this.server = new Server();
  }

  create(data) {
    this.background = this.add.image(width / 2, height / 2, "bg_menu");
    this.butCredit = new Button(this, 50, 50, "but_credit");
    this.butFullScreen = new Button(this, 120, 50, "but_fullscreen").setFrame(
      1
    );
    this.butAudio = new Button(this, width - 50, 50, "audio");

    this.logo = this.add.image(width / 2, height / 3, "logo_menu");
    this.butPlay = new Button(this, width / 2, height / 3 + 250, "but_play");

    this.tweens.add({
      targets: [this.butPlay, this.logo],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    this.input.on("gameobjectdown", (pointer, gameObject) => {
      switch (gameObject) {
        case this.butAudio:
          this.butAudio.setFrame(this.butAudio.frame.name == 0 ? 1 : 0);
          break;
        case this.butFullScreen:
          this.butFullScreen.setFrame(
            this.butFullScreen.frame.name == 0 ? 1 : 0
          );
          this.scale.toggleFullscreen();
          break;
        case this.butPlay:
          this.scene.start("room");
          break;
        case this.butCredit:
          this.scene.launch("credit");
          break;
      }
    });
  }

  exitFullScreen() {
    this.butFullScreen.setFrame(1);
  }
}
