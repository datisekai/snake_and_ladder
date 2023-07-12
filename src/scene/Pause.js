import Phaser from "phaser";
import config from "../config";
import WebFontFile from "../fonts/WebFontFile";
import Button from "../game-object/Button";

const { width, height, boardX, boardY, cellSize, size } = config;

export default class Pause extends Phaser.Scene {
  constructor() {
    super("pause");
  }


  create(data) {
    const { text } = data;

    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );

    this.messageText = this.add.text(width / 2, height / 2, "Pause", {
      fontFamily: "Permanent Marker",
      fontSize: "70px",
      color: "#ffffff",
    });

    this.exit = new Button(this, 1300, 50, "but_no");
    this.exit.setScale(0.5);
    this.help = new Button(this, 1300, 50, "but_help");
    this.fullscreen = new Button(this, 1300, 50, "but_fullscreen");
    this.fullscreen.setFrame(1);
    this.settings = new Button(this, 1300, 50, "but_settings");

    this.tweens.add({
      targets: this.exit,
      y: 120,
      duration: 500,
      ease: "Power2",
    });

    this.tweens.add({
      targets: this.help,
      y: 190,
      duration: 500,
      ease: "Power2",
    });

    this.tweens.add({
      targets: this.fullscreen,
      y: 260,
      duration: 500,
      ease: "Power2",
    });

    this.messageText.setOrigin(0.5, 0.5);

    this.input.on("gameobjectdown", (pointer, gameObject) => {
      switch (gameObject) {
        case this.settings:
          this.tweens.add({
            targets: [this.exit, this.help, this.fullscreen],
            y: 50,
            duration: 500,
            ease: "Power2",
          });

          setTimeout(() => {
            this.scene.stop("pause");
            this.scene.get("game").dice.setInteractive();
          }, 200);

          break;
        case this.fullscreen:
          this.fullscreen.setFrame(this.fullscreen.frame.name == 0 ? 1 : 0);
          this.scale.toggleFullscreen();
          break;
        case this.exit:
          this.scene.launch("confirm");
          break;
        case this.help:
          this.scene.launch("help");
          break;
      }
    });
  }

  exitFullScreen() {
    this.fullscreen.setFrame(1);
  }
}
