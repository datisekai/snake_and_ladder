import Phaser from "phaser";
import config from "../config";
import WebFontFile from "../fonts/WebFontFile";

const { width, height, boardX, boardY, cellSize, size } = config;

export default class GameEnd extends Phaser.Scene {
  constructor() {
    super("game-end");
  }

  preload() {}

  create(data) {
    const { text, server, players, playerId } = data;
    this.server = server;
    this.players = players;
    this.playerId = playerId;

    this.countdown = 5;

    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );

    this.msgBox = this.add.image(width / 2, height / 2, "msg_box");

    this.add
      .text(
        this.msgBox.x,
        this.msgBox.y + this.msgBox.height / 2 - 200,
        "countdown replay time",
        {
          fontFamily: "Permanent Marker",
          fontSize: "30px",
          color: "#ffffff",
        }
      )
      .setVisible(true)
      .setOrigin(0.5);

    this.textCountDown = this.add
      .text(
        this.msgBox.x,
        this.msgBox.y + this.msgBox.height / 2 - 150,
        this.countdown,
        {
          fontFamily: "Permanent Marker",
          fontSize: "60px",
          color: "#ffffff",
        }
      )
      .setVisible(true)
      .setOrigin(0.5);

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

    this.handleCountDown()
  }

  handleCountDown() {
    this.textCountDown.setVisible(true);
    setTimeout(() => {
      this.countdown -= 1;
      this.textCountDown.setText(this.countdown);

      if (this.countdown == 0) {
        this.scene.stop();
        this.scene.start("game", {
          server: this.server,
          players: this.players,
          playerId: this.playerId,
        });
      } else {
        this.handleCountDown();
      }
    }, 1000);
  }

  update() {}
}
