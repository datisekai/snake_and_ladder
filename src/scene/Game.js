import Phaser from "phaser";
import config from "../config";
import {
  LADDER_DEFINITION,
  PLAYER_DEFINITION,
  SNAKE_DEFINITION,
} from "../config/definition";
import Dice from "../game-object/Dice";
import Ladder from "../game-object/Ladder";
import Player from "../game-object/Player";
import Snake from "../game-object/Snake";
import TurnPanel from "../game-object/TurnPanel";
import Button from "../game-object/Button";
import Arrow from "../game-object/Arrow";

const { width, boardX, boardY, height, size, cellSize } = config;

const gameBoard = {
  board: {},
  ladders: [
    { id: 1, cell: 1 },
    {
      id: 2,
      cell: 9,
    },
    {
      id: 3,
      cell: 21,
    },
    {
      id: 4,
      cell: 4,
    },
    {
      id: 5,
      cell: 80,
    },
    {
      id: 6,
      cell: 36,
    },
    {
      id: 7,
      cell: 51,
    },
  ],
  snakes: [
    {
      id: 1,
      cell: 16,
    },
    {
      id: 2,
      cell: 47,
    },
    {
      id: 3,
      cell: 49,
    },
    {
      id: 4,
      cell: 56,
    },
    {
      id: 5,
      cell: 62,
    },
    {
      id: 6,
      cell: 64,
    },
  ],
};

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create(data) {
    const { server, players = [], playerId } = data;
    this.server = server;

    this.playerId = playerId

    this.map = [];
    this.players = [];

    players.forEach((player) => {
      this.players.push(new Player(this, this.players.length, player));
    });

    this.playerTurnIndex = 0;
    this.bg = this.add.image(width / 2, height / 2, "bg_game1");

    this.createBoard();
    this.createTurn();

    this.dice = new Dice(this, "but_dice");
    this.settings = new Button(this, 1300, 50, "but_settings");

    this.ladders = gameBoard.ladders.map((ladder) => {
      const ladderDefine = LADDER_DEFINITION.find(
        (item) => item.id === ladder.id
      );
      return { ...ladder, ...ladderDefine };
    });

    this.snakes = gameBoard.snakes.map((snake) => {
      const snakeDefine = SNAKE_DEFINITION.find((item) => item.id === snake.id);
      return { ...snake, ...snakeDefine };
    });

    //Create ladder
    this.ladders.forEach((item, index) => {
      new Ladder(this, item.id, item.cell);
    });

    this.snakes.forEach((item, index) => {
      new Snake(this, item.id, item.cell);
    });

    console.log(this.map);
    this.listenEvent();

    // this.scene.launch('game-end',{text:'You Won'})
  }

  createTurn() {
    this.turnPanel = new TurnPanel(this, 100, 200, "turn_panel");
    this.turnPanel.turn();

    const currentPlayer = this.players[this.playerTurnIndex];
    this.arrowTurn = new Arrow(
      this,
      currentPlayer.x + currentPlayer.width / 2,
      currentPlayer.y - currentPlayer.height - 20,
      "arrow"
    );
  }

  listenEvent() {
    this.input.on("gameobjectdown", async (pointer, gameObject) => {
      switch (gameObject) {
        case this.dice:
          this.arrowTurn.visible = false;
          const randomInt = await this.dice.random();
          let lastScore = this.players[this.playerTurnIndex].lastTurnScore;
          this.players[this.playerTurnIndex].increaseTargetScore(randomInt);

          if (randomInt == 6 && randomInt === lastScore) {
            this.scene.launch("notify", {
              title: "extra dice",
              direction: "horizontal",
            });
            this.playerTurnIndex = this.playerTurnIndex;
          } else if (this.playerTurnIndex === this.players.length - 1) {
            this.playerTurnIndex = 0;
          } else {
            this.playerTurnIndex += 1;
          }

          break;
        case this.settings:
          this.dice.disableInteractive();
          this.scene.launch("pause");
          break;
      }
    });
  }

  createBoard() {
    let x = boardX;
    let y = boardY + cellSize * size;
    let dir = 1;

    //dưới - trái
    for (let index = 0; index < size * size; index++) {
      this.map[index] = {
        x,
        y,
        dir,
        index: index + 1,
        ladder: null,
        snake: null,
      };
      x += cellSize * dir;

      if (x >= boardX + cellSize * size || x <= boardX - cellSize) {
        dir = -dir;
        x += cellSize * dir;
        y -= cellSize;
      }
    }
  }

  update() {
    // this.players.forEach((player) => {
    //   player.update();
    // });
  }
}
