import Phaser from "phaser";
import config from "../config";
import Button from "../game-object/Button";

const { width, height } = config;

export default class SelectPlayer extends Phaser.Scene {
  constructor() {
    super("select-player");
  }

  preload() {}

  create() {
    this.add.image(width / 2, height / 2, "bg_game0");

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    this.msgBox = this.add.image(width / 2, height / 2, "bg_help");

    this.exit = new Button(this, width - 50, 50, "exit").setScale(0.5);

    this.twoPlayer = new Button(
      this,
      this.msgBox.x - 70,
      this.msgBox.y + 20,
      "but_play_2"
    );
    this.threePlayer = new Button(
      this,
      this.msgBox.x + 70,
      this.msgBox.y + 20,
      "but_play_3"
    );

    this.add
    .text(this.msgBox.x, this.msgBox.y - 100, "Select Players", {
      fontFamily: "Permanent Marker",
      fontSize: "40px",
      color: "#ffffff",
      wordWrap: { width: this.msgBox.width - 80 },
    })
    .setOrigin(0.5);


    this.input.on("gameobjectdown", (pointer, gameobject) => {
      switch (gameobject) {
        case this.exit:
          this.scene.stop();
          this.scene.start("bootstrap");
          break;
        case this.twoPlayer:
          this.scene.stop();
          this.scene.start("room", { numOfPlayers: 2 });
          break;
        case this.threePlayer:
          this.scene.stop();
          this.scene.start("room", { numOfPlayers: 3 });
          break;
      }
    });
  }
}

