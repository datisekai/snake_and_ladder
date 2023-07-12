import Phaser from "phaser";
import config from "../config";
import WebFontFile from "../fonts/WebFontFile";

const { width, height, boardX, boardY, cellSize, size } = config;

export default class GameEnd extends Phaser.Scene {
  constructor() {
    super("game-end");
  }

  preload() {
   
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

    this.msgBox = this.add.image(width / 2, height / 2, "msg_box");

    this.butHome = this.add
      .image(this.msgBox.x - 70, this.msgBox.y + 80, "but_home")
      .setScale(0.7);
    this.butRestart = this.add
      .image(this.msgBox.x + 70, this.msgBox.y + 80, "but_restart")
      .setScale(0.7);

    this.butHome.setInteractive({ useHandCursor: true });
    this.butRestart.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: this.butRestart,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });


    this.messageText = this.add.text(
      this.msgBox.x - 140,
      this.msgBox.y - 100,
      text,
      {
        fontFamily: "Permanent Marker",
        fontSize: "70px",
        color: "#ffffff",
      }
    );
  }

  update() {}
}
