import Phaser from "phaser";
import { SNAKE_DEFINITION } from "../config/definition";
import config from "../config";

const { cellSize, size, boardX, boardY } = config;

export default class Snake extends Phaser.GameObjects.Sprite {
  constructor(scene, id, headIndex) {
    super(scene, 300, 400, `snake_${id}`);
    this.scene = scene;
    this.id = id;
    this.define = SNAKE_DEFINITION.find((item) => item.id === id);

    scene.add.existing(this);

    this.scene.anims.create({
      key: `snake_${id}_swallow`,
      frames: this.scene.anims.generateFrameNumbers(`snake_${id}`, {
        start: 1,
        end: 31,
      }),
      frameRate: 60,
      repeat: 0,
    });

    this.headIndex = headIndex;
    this.tailIndex = this.getTailIndex(headIndex);
    this.addToMap();
  }

  getTailIndex() {
    const current = this.scene.map[this.headIndex - 1];
    const tailIndex = this.scene.map.findIndex(
      (item) =>
        item.x == current.x + this.define.incX * cellSize &&
        item.y === current.y - this.define.incY * cellSize
    );

    return tailIndex + 1;
  }

  addToMap() {
    const current = this.scene.map[this.tailIndex - 1];

    const paddingX = this.define.paddingX || 0;
    const paddingY = this.define.paddingY || 0;
    this.x = current.x + paddingX;
    this.y = current.y + paddingY;
    switch (this.define.direction) {
      case "right":
        this.x += cellSize / 4;
        this.setOrigin(0, 1);
        break;
      case "left":
        this.x += cellSize;
        this.setOrigin(1, 1);
        break;
    }

    this.scene.map[this.headIndex - 1].snake = this;
  }
}
