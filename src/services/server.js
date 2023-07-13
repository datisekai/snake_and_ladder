import { Client } from "colyseus.js";

export default class Server {
  constructor() {
    const host = "wss://fresher.woay.io";
    // this.client = new Client("ws://localhost:2567");
    this.client = new Client(host);
    this.events = new Phaser.Events.EventEmitter();
    this.countNewGame = 0;
    this.isOnDiceChange = false;
    this.isOnNewGame = false;
    this.isOnStateChanged = false;
    this.isOnGameOver = false;
  }

  setGameBoard(state) {
    this.gameBoard = {
      board: state.board.toArray().map((item) => ({
        direction: item.direction,
        id: item.id,
        incX: item.incX,
        incY: item.incY,
        objectId: item.objectId,
        targetCell: item.targetCell,
        type: item.type,
        x: item.x,
        y: item.y,
      })),
      roomId: state.code,
      player1: { cell: state.player1.cell, id: state.player1.id },
      player2: { cell: state.player2.cell, id: state.player2.id },
    };
  }

  handleEvent() {
    this.room.onStateChange((state) => {
      this.events.emit("state-changed", state);
      if (state.code) {
        this.events.emit("get-room-code", state.code);
      }
      if (state.board) {
        console.log("called setstate board");
        this.setGameBoard(state);
      }
    });

    this.room.onMessage("gameOver", ({ winner }) => {
      this.events.emit("game-over", { winner });
    });

    this.room.onMessage("newGame", () => {
      this.events.emit("new-game");
    });

    this.room.onMessage("move", (data) => {
      this.events.emit("dice-changed", data);
    });
  }

  async create() {
    const room = await this.client.create("snake_and_ladder", {
      extraDice: true,
      upperBounce: true,
    });

    this.room = room;

    this.handleEvent();
  }

  handleRoll() {
    console.log("roll");
    this.room.send("roll");
  }

  onDiceChanged(callback, context) {
    !this.isOnDiceChange && this.events.on("dice-changed", callback, context);
    this.isOnDiceChange = true;
  }

  onGetRoomCode(callback, context) {
    this.events.on("get-room-code", callback, context);
  }

  async joinById(roomId) {
    console.log("joinByid", roomId);
    const room = await this.client.joinOrCreate("lobby");
    room.send("findRoom", roomId);
    room.onMessage("roomId", async (state) => {
      const newRoom = await this.client.joinById(state);
      this.room = newRoom;
      this.handleEvent();

      this.roomId = roomId;
      this.events.emit("get-room-code", roomId);
    });
  }

  onGameOver(callback, context) {
    !this.isOnGameOver && this.events.on("game-over", callback, context);
    this.isOnGameOver = true;
  }

  onNewGame(callback, context) {
    !this.isOnNewGame && this.events.on("new-game", callback, context);
    this.isOnNewGame = true;
  }

  onStateChanged(callback, context) {
    !this.isOnStateChanged &&
      this.events.on("state-changed", callback, context);
    this.isOnStateChanged = true;
  }
}
