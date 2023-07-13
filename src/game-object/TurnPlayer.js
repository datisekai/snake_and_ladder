import Phaser from "phaser";

export default class TurnPlayer extends Phaser.GameObjects.Sprite {
  constructor(scene, frame, activeFrame, x, y, id) {
    super(scene, x, y, "turn", frame);

    this.frame0 = frame
    this.activeFrame = activeFrame
    this.id = id


    this.scene = scene
    scene.add.existing(this)
  }

  activeTurn(){
    this.setFrame(this.activeFrame)
  }

  back(){
    this.setFrame(this.frame0)
  }
}
