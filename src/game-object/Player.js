import Phaser from "phaser";
import config from "../config";

const { boardX, boardY, cellSize, height, size, width } = config;

const gapX = 30;

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, index, sessionId) {
    const x = boardX - cellSize - index * gapX;
    const y = boardY + cellSize * size;
    super(scene, x, y, `player_${index}`);
    scene.add.existing(this);

    this.sessionId = sessionId;

    this.setOrigin(0, 1);

    this.scene = scene;
    this.score = this.targetScore = 0;
    this.isSuperPreUpdate = false;

    this.isTweenRunning = false;

    this.snake = null;

    this.index = index;

    this.depth = 2;

    this.createAnims();

    this.play(`player_turn_${index}`, true);

    this.lastTurnScore = 0;
  }

  createAnims() {
    this.scene.anims.create({
      key: `player_turn_${this.index}`,
      frames: this.scene.anims.generateFrameNumbers(`player_${this.index}`, {
        start: 0,
        end: 26,
      }),
      repeat: -1,
    });

    this.scene.anims.create({
      key: `player_move_${this.index}`,
      frames: this.scene.anims.generateFrameNumbers(`player_${this.index}`, {
        start: 27,
        end: 40,
      }),
      frameRate: 30,
      repeat: -1,
    });
  }

  increaseTargetScore(score) {
    this.lastTurnScore = score;
    if (this.targetScore + score >= 100) {
      this.targetScore = 100;
      return;
    }
    this.targetScore += score;

    this.move();
  }

  hasLadder(target) {
    this.scene.scene.launch("notify", { title: "NICE" });
    this.score = target.ladder.tailIndex - 1;
    this.targetScore = target.ladder.tailIndex;
  }

  hasSnake(target) {
    this.snake = target.snake;
    this.score = target.snake.tailIndex - 1;
    this.targetScore = target.snake.tailIndex;
  }

  switchTurn() {
    this.scene.turnPanel.turn();
    this.scene.arrowTurn.switchTurn();
  }

  reset() {
    this.scene.dice.reset();
    this.play(`player_turn_${this.index}`, true);
  }

  checkLadderAndSnake(target) {
    let isRunning = false;
    if (target.ladder) {
      this.hasLadder(target);
      isRunning = true;
    }

    if (target.snake) {
      this.hasSnake(target);
      isRunning = true;
    } else {
      this.snake = null;
      this.visible = true;
    }

    return isRunning;
  }

  snakeSwallow() {
    this.visible = false;
    this.snake.play(`snake_${this.snake.id}_swallow`);
  }

  move() {
    this.score += 1;
    const target = this.scene.map[this.score - 1];

    this.scene.tweens.add({
      targets: this,
      x: target.x,
      y: target.y - cellSize / 3,
      duration: 400,
      ease: "Linear",
      onStart: () => {
        this.flipX = target.dir === -1;
        this.play(`player_move_${this.index}`, true);

        if (this.snake) {
          this.scene.scene.launch("notify", { title: "SORY..." });
          this.snakeSwallow();
        }
      },
      onComplete: () => {
        this.x = target.x;
        if (this.score === this.targetScore) {
          if (this.checkLadderAndSnake(target)) {
            return this.move();
          }

          this.switchTurn();
          this.reset();

          return;
        }

        return this.move();
      },
    });
  }
}
