import Phaser from "phaser";
import config from "../config";

const { boardX, boardY, cellSize, height, size, width } = config;

const gapX = 30;

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, index, id) {
    const position = scene.map[0];
    // const x = boardX - cellSize - index * gapX;
    // const y = boardY + cellSize * size;
    const x = position.x;
    const y = position.y - cellSize / 3;
    super(scene, x, y, `player_${index}`);
    scene.add.existing(this);

    this.id = id;

    this.setOrigin(0, 1);

    this.scene = scene;
    this.score = this.targetScore = 1;
    this.isSuperPreUpdate = false;

    this.isTweenRunning = false;

    this.snake = null;

    this.index = index;

    this.depth = 2;

    this.isAutoRoll = false;

    this.createAnims();

    this.play(`player_turn_${index}`, true);
  }

  setAutoRoll(){
    this.isAutoRoll = !this.isAutoRoll
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

  setTargetServerScore(score) {
    this.targetServerScore = score;
  }

  increaseTargetScore(score) {
    if (this.targetScore + score > 100) {
      this.score -= 1;
      this.move();
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
    if (this.scene.playerTurn === this.scene.playerId) {
      this.scene.dice.reset();
      console.log(this.isAutoRoll)
      // if (this.isAutoRoll) {
        setTimeout(() => {
          this.scene.rollDice();
        }, 500);
      // }
    } else {
      this.scene.dice.disable();
    }

    this.scene.turnPanel.turn();
    this.scene.arrowTurn.switchTurn();
  }

  reset() {
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

  syncServer() {
    if (this.targetServerScore && this.targetServerScore !== this.score) {
      this.score = this.targetServerScore - 1;
      this.targetScore = this.targetServerScore;
      this.move();
    }
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

        this.scene.arrowTurn.visible = false;

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

          this.syncServer();

          if (this.score !== 100) {
            this.switchTurn();
            this.reset();
          }

          return;
        }

        return this.move();
      },
    });
  }
}
