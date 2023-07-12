import Phaser from "phaser";
import config from "../config";
import { LADDER_DEFINITION } from "../config/definition";

const { boardX, boardY, cellSize, height, size, width } = config;

export default class Ladder extends Phaser.GameObjects.Image {
  constructor(scene, id, headIndex = null, tailIndex = null) {
    super(scene, 400, 400, `ladder_${id}`);
    this.scene = scene;

    this.id = id;

    this.define = LADDER_DEFINITION.find((item) => item.id === id);

    this.setDepth(1);

    scene.add.existing(this);

    this.headIndex = headIndex;
    this.tailIndex = this.getTailIndex(headIndex);

    this.addToMap();
  }

  addToMap() {
    const { x, y } = this.scene.map[this.headIndex - 1];

    this.x = x;
    this.y = y - cellSize / 3;

    switch (this.define.direction) {
      case "EN":
        this.x += cellSize / 4;
        this.setOrigin(0, 1);
        break;
      case "WN":
        this.x += cellSize / 2;
        this.setOrigin(1, 1);
        break;
      case "N":
        this.x += cellSize / 2;
        this.y -= cellSize / 4;
        this.setOrigin(0.5, 1);
        break;
    }

    this.scene.map[this.headIndex - 1].ladder = this;
  }

  getTailIndex(headIndex) {
    const current = this.scene.map[headIndex - 1];
    const tailIndex = this.scene.map.findIndex(
      (item) =>
        item.x == current.x + this.define.incX * cellSize &&
        item.y === current.y - this.define.incY * cellSize
    );

    return tailIndex + 1
  }
}
