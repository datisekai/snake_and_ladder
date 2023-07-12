import Phaser from "phaser";
import config from "../config";
import Button from "../game-object/Button";

const { width, height } = config;

export default class Help extends Phaser.Scene {
  constructor() {
    super("help");
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

    this.createTextHelp();
    this.createHelpLadder();
    this.createHelpSnake();

    this.skip = new Button(
      this,
      this.msgBox.x,
      this.msgBox.y + this.msgBox.height / 2 - 25,
      "skip"
    );

    this.input.on("gameobjectdown", (pointer, gameObject) => {
      switch (gameObject) {
        case this.skip:
          this.scene.stop("pause");
          this.scene.stop("help");
          this.scene.get("game").dice.setInteractive();
          break;
      }
    });
  }

  createTextHelp() {
    this.add.text(
      this.msgBox.x - 230,
      this.msgBox.y - 170,
      "Reach the end of the board launching the dice. Rolling a 6 will give the player extra dice",
      {
        fontFamily: "Permanent Marker",
        fontSize: "30px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 80 },
      }
    );
  }

  createHelpLadder() {
    this.helpLadder = this.add.image(
      this.msgBox.x - 180,
      this.msgBox.y,
      "help_ladder"
    );

    this.add.text(
      this.helpLadder.x + this.helpLadder.width / 2 + 20,
      this.helpLadder.y - 30,
      "Ladder: You go up",
      {
        fontFamily: "Permanent Marker",
        fontSize: "30px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 80 },
      }
    );

    this.playerHelpLadder = this.add.image(
      this.helpLadder.x + this.helpLadder.width / 2,
      this.helpLadder.y + this.helpLadder.height / 2 - 20,
      "help_player"
    );
    this.playerHelpLadder.setOrigin(1, 1);

    this.tweens.add({
      targets: this.playerHelpLadder,
      y:
        this.helpLadder.y -
        this.helpLadder.height / 2 +
        this.playerHelpLadder.height -
        20,
      x:
        this.helpLadder.x -
        this.helpLadder.width / 2 +
        this.playerHelpLadder.width,
      duration: 2000,
      ease: "Power2",
      repeat: -1,
    });
  }

  createHelpSnake() {
    this.helpSnake = this.add.image(
      this.msgBox.x + this.msgBox.width / 2 - 130,
      this.msgBox.y + this.msgBox.height / 5,
      "help_snake"
    );

    this.playerHelpSnake = this.add.image(
      this.helpSnake.x - this.helpSnake.width / 2 + 50,
      this.helpSnake.y - this.helpSnake.height / 2 + 50,
      "help_player"
    );
    this.playerHelpSnake.setOrigin(1, 1);

    this.tweens.add({
      targets: this.playerHelpSnake,
      y:
        this.helpSnake.y +
        this.helpSnake.height / 2 -
        this.playerHelpSnake.height +
        50,
      x:
        this.helpSnake.x +
        this.helpSnake.width / 2 -
        this.playerHelpSnake.width +
        50,
      duration: 2000,
      ease: "Power2",
      repeat: -1,
    });

    this.add.text(
      this.helpSnake.x - 370,
      this.helpSnake.y - 20,
      "Snake: You go down",
      {
        fontFamily: "Permanent Marker",
        fontSize: "30px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 80 },
      }
    );
  }
}
