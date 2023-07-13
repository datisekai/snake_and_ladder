import Phaser from "phaser";

export default class Arrow extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.depth = 2;
    scene.add.existing(this);
  }

  switchTurn() {
    const currentPlayer = this.scene.players[this.scene.playerTurn - 1];
    this.x = currentPlayer.x + currentPlayer.width / 2;
    this.y = currentPlayer.y - currentPlayer.height - 20;

    this.visible = true;

  }
}
