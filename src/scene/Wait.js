import Phaser from "phaser";
import config from "../config";
import Button from "../game-object/Button";
import TurnPlayer from "../game-object/TurnPlayer";
import Server from "../services/server";

const { width, height } = config;

export default class Wait extends Phaser.Scene {
  constructor() {
    super("wait");
  }

  create(data) {
    this.players = [];

    this.countdown = 5;
    this.background = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000
    );

    this.msgBox = this.add.image(width / 2, height / 2, "bg_help");

    // this.exit = new Button(
    //   this,
    //   this.msgBox.x + this.msgBox.width / 2 - 70,
    //   this.msgBox.y - this.msgBox.height / 2 + 70,
    //   "exit"
    // ).setScale(0.5);

    this.textRoomId = this.add.text(
      this.msgBox.x - this.msgBox.width / 2 + 50,
      this.msgBox.y - this.msgBox.height / 2 + 50,
      "Loading...",
      {
        fontFamily: "Permanent Marker",
        fontSize: "30px",
        color: "#ffffff",
      }
    );

    const { server, type } = data;
    this.server = server;
    this.type = type;

    this.textCountPlayer = this.add.text(
      this.msgBox.x + this.msgBox.width / 2 - 200,
      this.msgBox.y - this.msgBox.height / 2 + 50,
      `1/2`,
      {
        fontFamily: "Permanent Marker",
        fontSize: "30px",
        color: "#ffffff",
      }
    );

    this.textCountDown = this.add
      .text(
        this.msgBox.x + this.msgBox.width / 2 - 100,
        this.msgBox.y + this.msgBox.height / 2 - 120,
        this.countdown,
        {
          fontFamily: "Permanent Marker",
          fontSize: "40px",
          color: "#ffffff",
        }
      )
      .setVisible(false);

    this.add
      .text(this.msgBox.x - 100, this.msgBox.y - 70, "Waiting...", {
        fontFamily: "Permanent Marker",
        fontSize: "40px",
        color: "#ffffff",
        wordWrap: { width: this.msgBox.width - 80 },
      })
      .setInteractive({ useHandCursor: true });

    this.input.on("gameobjectdown", (pointer, gameobject) => {
      switch (gameobject) {
        // case this.exit:
        //   this.scene.stop("wait");
        //   this.scene.start("bootstrap");
        //   break;
      }
    });

    this.handleServer();
  }

  handleCountDown(isHiddenText) {
    !isHiddenText && this.textCountDown.setVisible(true);
    setTimeout(() => {
      this.countdown -= 1;
      !isHiddenText && this.textCountDown.setText(this.countdown);

      if (this.countdown == 0) {
        this.scene.start("game", {
          server: this.server,
          playerId: this.playerId,
          players: this.players.map((item) => item.id),
        });
      } else {
        this.handleCountDown(isHiddenText);
      }
    }, 1000);
  }

  addPlayer(id) {
    this.players.push(new TurnPlayer(this, this.players.length, 0, 0, 0, id));
    this.renderPlayer();
  }

  setRoomId(roomId) {
    this.roomId = roomId;
    this.textRoomId.setText(`RoomID: ${this.roomId}`);
  }

  setTextCountPlayer() {
    this?.textCountPlayer?.setText(`${this?.players?.length || 2}/2`);
  }

  renderPlayer() {
    Phaser.Actions.GridAlign(this.players, {
      width: 6,
      height: 1,
      cellWidth: 50,
      cellHeight: 50,
      x: this.msgBox.x - 50,
      y: this.msgBox.y + 20,
    });
  }

  async handleServer() {
    switch (this.type) {
      case "create":
        this.playerId = 1;
        this.addPlayer(1);
        break;
      case "join":
        this.playerId = 2;
        this.addPlayer(1);
        this.addPlayer(2);
        this.setTextCountPlayer();
        this.handleCountDown();
        break;
    }

    // this.handleCountDown();

    this.server.onNewGame(() => {
      if(this.server.countNewGame > 0){
        this.handleCountDown(true)
      }else{
        if (this.type == "create") {
          this.addPlayer(2);
          this.setTextCountPlayer();
          this.handleCountDown(false);
        }

        this.server.countNewGame += 1
      }
    });

    this.server.onGetRoomCode((roomId) => {
      this.setRoomId(roomId);
    });
    // this.server.onRemovePlayer(({ player, sessionId }) => {
    //   this.players = this.players.filter((item) => {
    //     if (item.sessionId === sessionId) {
    //       item.destroy();
    //     }
    //     return item.sessionId !== sessionId;
    //   });
    //   this.renderPlayer();
    //   this.setTextCountPlayer();
    // });
  }
}
