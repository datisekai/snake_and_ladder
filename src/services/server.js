import { Client } from "colyseus.js";

export default class Server {
  constructor() {
    this.client = new Client("wss://fresher.woay.io");
    this.events = new Phaser.Events.EventEmitter();
  }

  leaveRoom() {
    this.room.leave();
  }

  handleEvent() {
    this.room.onStateChange.once((state) => {
      this.events.emit("once-state-changed", state);
    });
    // this.room.state.players.onAdd((player, sessionId) => {
    //   this.events.emit("add-player", { player, sessionId });
    // });

    // this.room.state.players.onRemove((player, sessionId) => {
    //   this.events.emit("remove-player", { player, sessionId });
    // });

    this.room.onMessage('move',(data) => {
      this.events.emit('roll-changed',data)
    })

  }

  getRoomPlayer() {
    const players = [];
    this.room.state.players.forEach((key, value) => {
      console.log(value);
    });
  }

  async join() {
    console.log("join");
    const room = await this.client.create("snake_and_ladder");
    window.room = room;
    room.send('roll');
    room.onStateChange.once((state) => {
      window.state = state;

      console.log(state.code);
    });
    
    // room.state.player1.onChange(state => {
    //   console.log(state)
    // })

    room.onMessage('move',(state) => {
      console.log(state)
    })

    this.room = room;

    this.handleEvent();
  }

  handleRoll(){
    this.room.send('roll');
  }

  onRollChanged(callback, context){
    this.events.on('roll-changed',callback, context)
  }


  async joinById(roomId) {
    const room = await this.client.joinOrCreate("lobby");
    console.log("room", room);
    room.send("findRoom", roomId);
    room.onMessage("roomId", (roomId) => {
      console.log("joinById", roomId);
      this.client.joinById(roomId);
    });
    this.room = room;
    this.handleEvent();
  }

  onAddPlayer(callback, context) {
    this.events.on("add-player", callback, context);
  }

  onRemovePlayer(callback, context) {
    this.events.on("remove-player", callback, context);
  }

  onceStateChanged(callback, context) {
    this.events.once("once-state-changed", callback, context);
  }
}
