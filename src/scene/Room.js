import Phaser from "phaser";
import config from "../config";
import Button from "../game-object/Button";
import Server from "../services/server";
import ButtonCustom from "../game-object/ButtonCustom";

const { width, height } = config;

export default class Room extends Phaser.Scene {
  constructor() {
    super("room");
    this.server = new Server();
  }

  create() {
    this.add.image(width / 2, height / 2, "bg_game0");

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    this.msgBox = this.add.image(width / 2, height / 2, "bg_help");

    this.exit = new Button(
      this,
      this.msgBox.x + this.msgBox.width / 2 - 70,
      this.msgBox.y - this.msgBox.height / 2 + 70,
      "exit"
    ).setScale(0.5);

    this.textBought = this.add.text(
      this.msgBox.x - 170,
      this.msgBox.y - 150,
      "go to the room to play with friends",
      {
        fontFamily: "Permanent Marker",
        fontSize: "40px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 150 },
      }
    );

    this.btnCreateRoom = new ButtonCustom(
      this,
      this.msgBox.x,
      this.msgBox.y,
      200,
      50,
      "Create",
      0x30e451,
      0x1c842c
    );

    this.btnJoinRoom = new ButtonCustom(
      this,
      this.msgBox.x,
      this.msgBox.y + 60,
      200,
      50,
      "Join"
    );

    this.input.on("gameobjectdown", async (pointer, gameobject) => {
      switch (gameobject) {
        case this.exit:
          this.scene.stop();
          this.scene.start("bootstrap");
          break;
        case this.btnCreateRoom:
          await this.server.create();
          this.scene.stop();
          this.scene.start("wait", {
            server: this.server,
            type:"create"
          });
          break;
        case this.btnJoinRoom:
          this.scene.stop();
          this.scene.start("keyboard", { server: this.server });
          break;
      }
    });
  }
}
