import Phaser from "phaser";

export default class Arrow extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.depth = 2;
    scene.add.existing(this);
  }

  switchTurn() {
    const currentPlayer = this.scene.players[this.scene.playerTurnIndex];
    this.x = currentPlayer.x + currentPlayer.width / 2;
    this.y = currentPlayer.y - currentPlayer.height - 20;

    this.visible = true;

    // this.scene.tweens.add({
    //   targets: this,
    //   y: "this.",
    //   duration: 500,
    //   ease: "Sine.easeInOut",
    //   repeat: -1,
    //   yoyo:true 
    // });
  }
}
