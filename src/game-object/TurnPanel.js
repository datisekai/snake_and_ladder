import Phaser from "phaser";
import TurnPlayer from "./TurnPlayer";

const spacing = 30;

export default class TurnPanel extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;

    scene.add.existing(this);

    this.playerX = this.x;
    this.playerY = 80;
    this.turnPlayers = [];
    this.renderPlayer();
  }

  turn() {
    this.turnPlayers.forEach((item) => {
      item.back();
    });
    const index = this.scene.playerTurnIndex;
    this.turnPlayers[index].activeTurn();
  }

  addPlayer(index) {
    const turnPlayer = new TurnPlayer(
      this.scene,
      index,
      index + 5,
      this.playerX,
      this.playerY
    );
    this.turnPlayers.push(turnPlayer);

    this.playerY += turnPlayer.height / 2 + spacing;
  }

  renderPlayer() {
    this.scene.players.forEach((item, index) => {
      const turnPlayer = new TurnPlayer(
        this.scene,
        index,
        index + 5,
        this.playerX,
        this.playerY
      );
      this.turnPlayers.push(turnPlayer);

      this.playerY += turnPlayer.height / 2 + spacing;
    });
  }
}
