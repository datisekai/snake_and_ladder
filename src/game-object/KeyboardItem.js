import Phaser from "phaser";

export default class KeyboardItem extends Phaser.GameObjects.Rectangle {
  constructor(
    scene,
    CELL_SIZE,
    value,
    backgroundColor = 0xFB9057,
    borderColor = 0xF75C1E
  ) {
    super(scene, 0, 0, CELL_SIZE, CELL_SIZE, backgroundColor);

    this.scene = scene;

    scene.add.existing(this);

    this.value = value;

    this.setInteractive({ useHandCursor: true });
    this.setStrokeStyle(4, borderColor);
  }

  createText() {
    this.scene.add
      .text(this.x, this.y, this.value, {
        fontFamily: "Permanent Marker",
        fontSize: "30px",
        color: "#ffffff",
      })
      .setShadow(-5, 5, "rgba(0,0,0,0.5)", 0)
      .setOrigin(0.5);
  }
}
