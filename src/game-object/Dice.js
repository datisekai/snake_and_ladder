import Phaser from "phaser";

export default class Dice extends Phaser.GameObjects.Sprite {
  constructor(scene, texture) {
    super(scene, 1300, 550, texture);

    scene.add.existing(this);
    this.scene = scene;

    this.setInteractive({ useHandCursor: true });

    this.currentDice = null;
    this.createAnims();
  }

  createAnims() {
    const diceNum = 6;
    for (let i = 1; i <= diceNum; i++) {
      this.scene.anims.create({
        key: `random_dice_${i}`,
        frames: this.anims.generateFrameNumbers(`dice_${i}`, {}),
        frameRate: 10,
        repeat: 0,
      });
    }
  }

  random() {
    if (!this.currentDice) {
      this.setFrame(1);
      this.disableInteractive();
      const randomInt = Phaser.Math.Between(1, 6);
      this.currentDice = this.scene.add.sprite(1100, 400, `dice_${randomInt}`);

      this.currentDice.play(`random_dice_${randomInt}`);

      return new Promise((resolve) => {
        this.currentDice.on("animationcomplete", (animation, frame) => {
          if (animation.key === `random_dice_${randomInt}`) {
            resolve(randomInt);
          }
        });
      });
    }
  }

  reset() {
    this.setFrame(0);
    this.setInteractive();
    if (this.currentDice) {
      this.currentDice.destroy();
      this.currentDice = null;
    }
  }
}
