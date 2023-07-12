import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);

    this.scene = scene;

    this.setOrigin(0.5)

    this.setInteractive({ useHandCursor: true });
  }
}
