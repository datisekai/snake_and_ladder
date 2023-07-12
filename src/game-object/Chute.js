import Phaser from "phaser";
import { CHUTE_DEFINITION } from "../config/definition";
import config from "../config";

const { cellSize, size, boardX, boardY } = config;

export default class Chute extends Phaser.GameObjects.Image {
  constructor(scene, index) {
    super(scene, 0, 0, `chute_${index}`);

    this.index = index;
    this.scene = scene;

    this.define = CHUTE_DEFINITION[index];

    this.scene.add.existing(this);

    this.create();
  }

  create() {
    const limit = this.getLimitPosition();
    this.tailIndex = this.randomTailIndex(limit);
    if (this.tailIndex) {
      this.headIndex = this.getHeadIndex(this.tailIndex);
    }
    if (this.tailIndex && this.headIndex) {
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

      this.scene.map[this.headIndex - 1].chute = this;
      return;
    }

    this.destroy()
  }

  isExist(headIndex, tailIndex) {
    if (
      this.scene.map[headIndex - 1].ladder ||
      this.scene.map[tailIndex - 1].ladder ||
      this.scene.map[headIndex - 1].chute ||
      this.scene.map[tailIndex - 1].chute
    ) {
      return true;
    }
    return false;
  }

  randomTailIndex(limit) {
    const [startX, endX, startY, endY] = limit;
    const fitChutes = this.scene.map.filter(
      (item) =>
        item.x >= startX &&
        item.x <= endX &&
        item.y >= startY &&
        item.y <= endY &&
        !item.chute &&
        !item.ladder
    );

    let randomInt;

    let isRunning = true;
    let countLoop = 0;
    while (isRunning) {
      if (countLoop > 10) {
        isRunning = false;
      }
      countLoop++;
      randomInt = Phaser.Math.Between(0, fitChutes.length - 1);

      const current = fitChutes[randomInt];

      const headIndex = this.getHeadIndex(current.index);

      if (!this.isExist(headIndex, current.index)) {
        const chutes = this.scene.map.filter((item) => item.chute);

        if (chutes.length == 0) {
          isRunning = false;
        }

        if (chutes.length > 0) {
          const image = this.scene.add.image(
            current.x,
            current.y + cellSize,
            `chute_${this.index}`
          );
          switch (this.define.direction) {
            case "right":
              image.setOrigin(0, 1);
              image.x += cellSize / 4;
              break;
            case "left":
              image.x += cellSize;
              image.setOrigin(1, 1);
              break;
          }

          let flag = false;

          const boundsA = image.getBounds();
          for (let item of chutes) {
            const boundsB = item.chute.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)) {
              flag = true;
              break;
            }
          }

          image.destroy();

          if (!flag) {
            isRunning = false;
          }
        }
      }
    }

    return randomInt ? fitChutes[randomInt].index : undefined;
  }

  getHeadIndex(tailIndex) {
    const current = this.scene.map[tailIndex - 1];
    const chuteHead = this.scene.map.find(
      (item) =>
        item.x == current.x + this.define.headX * cellSize &&
        item.y === current.y - this.define.headY * cellSize
    );

    return chuteHead?.index;
  }

  getLimitPosition() {
    let startChuteX = 0;
    switch (this.define.direction) {
      case "right":
        startChuteX = boardX;
        break;
      case "left":
        startChuteX = boardX - this.define.incX * cellSize;
      default:
        break;
    }

    const endChuteX =
      boardX + cellSize * size - this.define.incX * cellSize - cellSize;
    const startChuteY = boardY + this.define.incY * cellSize + cellSize;
    const endChuteY = boardY + cellSize * size;
    return [startChuteX, endChuteX, startChuteY, endChuteY];
  }
}
