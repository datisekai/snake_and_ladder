import Phaser from "phaser";
import config from "../config";
import WebFontFile from "../fonts/WebFontFile";

const { width, height, boardX, boardY, cellSize, size } = config;

export default class Confirm extends Phaser.Scene {
  constructor() {
    super("confirm");
  }

  preload() {
 
  }

  create(data) {
    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );

    this.msgBox = this.add.image(width / 2, height / 2, "msg_box");

    this.butExit = this.add
      .image(this.msgBox.x - 70, this.msgBox.y + 80, "but_exit")
      .setScale(2);
    this.butYes = this.add.image(
      this.msgBox.x + 70,
      this.msgBox.y + 80,
      "but_yes"
    );

    this.butExit.setInteractive({ useHandCursor: true });
    this.butYes.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.butExit,
      scaleX: 2.1,
      scaleY: 2.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    this.messageText = this.add.text(
      this.msgBox.x - 250,
      this.msgBox.y - 100,
      "ARE YOU SURE?",
      {
        fontFamily: "Permanent Marker",
        fontSize: "65px",
        color: "#ffffff",
      }
    );


 
    this.input.on("gameobjectdown", (pointer, gameObject) => {
      switch (gameObject) {
        case this.butExit:
          this.scene.stop("confirm");
          this.scene.stop("pause");
          this.scene.get("game").dice.setInteractive();
          break;
        case this.butYes:
          console.log('call')
          this.scene.stop('game')
          this.scene.stop('pause')
          this.scene.start('bootstrap')
          break;
      }
    });
  }

 
}
