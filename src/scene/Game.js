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

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create(data) {
    const { server, players, playerId } = data;
    console.log('Again', players, playerId)
    this.server = server;
    this.players0 = players;

    const gameBoard = {};

    gameBoard.ladders = server.gameBoard.board
      .filter((item) => item.type === "ladder")
      .map((item) => ({ id: item.objectId, cell: item.id }));

    gameBoard.snakes = server.gameBoard.board
      .filter((item) => item.type === "snake")
      .map((item) => ({ id: item.objectId, cell: item.id }));

    console.log('snakes', gameBoard.snakes)

    console.log("gamesnakes", gameBoard.snakes);
    this.playerId = playerId;

    this.map = [];
    this.players = [];

    this.createBoard();

    players.forEach((playerId) => {
      this.players.push(new Player(this, this.players.length, playerId));
    });

    this.playerTurn = 1;
    this.bg = this.add.image(width / 2, height / 2, "bg_game1");

    this.createTurn();

    this.dice = new Dice(this, "but_dice");
    this.settings = new Button(this, 1300, 50, "but_settings");

    console.log('playerId', this.playerId, 'playerTurn', this.playerTurn)
    if (this.playerId !== this.playerTurn) {
      this.dice.disable();
    } else {
      this.dice.reset();
    }

    this.ladders = gameBoard.ladders.map((ladder) => {
      const ladderDefine = LADDER_DEFINITION.find(
        (item) => item.id === ladder.id
      );
      return { ...ladder, ...ladderDefine };
    });

    this.snakes = [];

    gameBoard.snakes.forEach((item) => {
      const snake = SNAKE_DEFINITION.find((s) => s.id === item.id);
      if (snake) {
        this.snakes.push({ ...item, ...snake });
      }
    });

    // this.snakes = gameBoard.snakes.map((snake) => {
    //   const snakeDefine = SNAKE_DEFINITION.find((item) => item.id === snake.id);
    //   return { ...snake, ...snakeDefine };
    // });

    //Create ladder
    this.ladders.forEach((item, index) => {
      new Ladder(this, item.id, item.cell);
    });

    this.snakes.forEach((item, index) => {
      new Snake(this, item.id, item.cell);
    });

    this.listenEvent();
    this.listenEventServer();

  }


  createTurn() {
    this.turnPanel = new TurnPanel(this, 100, 200, "turn_panel");
    this.turnPanel.turn();

    const currentPlayer = this.players[this.playerTurn - 1];
    this.arrowTurn = new Arrow(
      this,
      currentPlayer.x + currentPlayer.width / 2,
      currentPlayer.y - currentPlayer.height - 20,
      "arrow"
    );
  }

  listenEventServer() {
    this.server.onGameOver(({ winner }) => {
      const playerWinnerId = winner;
      this.playerTurn = 1
      this.scene.launch("game-end", {
        text: playerWinnerId === this.playerId ? "You Win" : "You Loss",
        server: this.server,
        players: this.players0,
        playerId: this.playerId,
      });
    });

    this.server.onStateChanged((state) => {
      const turn = state.turn;
      const player1 = { id: state.player1.id, cell: state.player1.cell };
      const player2 = { id: state.player2.id, cell: state.player2.cell };

      console.log(
        "turn",
        {
          turn: state.turn,
          player1: state.player1,
          player2: state.player2,
        },
        state
      );

      this.playerTurn = turn;
    });

    this.server.onDiceChanged(async (data) => {
      console.log(data);
      const { dice, playerId, playerCell } = data;

      await this.dice.random(dice);

      if (dice == 6 && playerId == this.playerId) {
        this.scene.launch("notify", { title: "EXTRA DICE" });
      }
      const currentPlayer = this.players[playerId - 1];
      if (currentPlayer) {
        currentPlayer.increaseTargetScore(dice);
        currentPlayer.setTargetServerScore(playerCell);
      }
    });
  }

  rollDice() {
    this.server.handleRoll();
  }

  listenEvent() {
    this.input.on("gameobjectdown", async (pointer, gameObject) => {
      switch (gameObject) {
        case this.dice:
          console.log(this.playerTurn, this.playerId);
          this.arrowTurn.visible = false;
          if (this.playerTurn === this.playerId) {
            this.rollDice();
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
