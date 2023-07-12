import Phaser from "phaser";
import config from "../config";
import Button from "../game-object/Button";

const { width, height } = config;

export default class Credit extends Phaser.Scene {
  constructor() {
    super("credit");
  }

  preload() {
  
  }

  create() {
    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );

    this.msgBox = this.add.image(width / 2, height / 2, "bg_help");

    this.exit = new Button(
      this,
      this.msgBox.x + this.msgBox.width / 2 - 70,
      this.msgBox.y - this.msgBox.height / 2 + 70,
      "exit"
    ).setScale(0.5);

    this.createTextCredit();

    this.input.on("gameobjectdown", (pointer, gameobject) => {
      switch (gameobject) {
        case this.textBought:
        case this.textName:
          window.open(
            "https://www.facebook.com/profile.php?id=100088767194778",
            "_blank"
          );
          break;
        case this.exit:
          this.scene.stop("credit");
          break;
      }
    });
  }

  createTextCredit() {
    this.textBought = this.add
      .text(this.msgBox.x - 170, this.msgBox.y - 100, "Brought to you by", {
        fontFamily: "Permanent Marker",
        fontSize: "40px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 80 },
      })
      .setInteractive({ useHandCursor: true });

    this.textName = this.add
      .text(this.msgBox.x - 170, this.msgBox.y, "Datisekai", {
        fontFamily: "Permanent Marker",
        fontSize: "40px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 80 },
      })
      .setInteractive({ useHandCursor: true });
  }
}
