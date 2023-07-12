import Phaser from "phaser";
import config from "../config";

const { width, height } = config;

export default class Notify extends Phaser.Scene {
  constructor() {
    super("notify");
  }

  create(data) {
    const { title, direction = "vertical" } = data;

    let initX = 0;
    let initY = 0;

    switch (direction) {
      case "vertical":
        initX = width / 2;
        break;
      case "horizontal":
        initY = height / 2;
        break;
    }

    this.title = this.add
      .text(initX, initY, title, {
        fontFamily: "Permanent Marker",
        fontSize: "40px",
        color: "#ffffff",
      })
      .setOrigin(0.5).setShadow(-5, 5, "rgba(0,0,0,0.5)", 0);

    switch (direction) {
      case "vertical":
        this.tweens.add({
          targets: this.title,
          y: height / 2,
          duration: 500,
          ease: "Power2",
          onComplete: () => {
            setTimeout(() => {
              this.tweens.add({
                targets: this.title,
                y: height + 100,
                duration: 500,
                ease: "Power2",
                onComplete: () => {
                  this.title.destroy();
                },
              });
            }, 400);
          },
        });
        break;
      case "horizontal":
        this.tweens.add({
          targets: this.title,
          x: width / 2,
          duration: 500,
          ease: "Power2",
          onComplete: () => {
            setTimeout(() => {
              this.tweens.add({
                targets: this.title,
                x: width + 100,
                duration: 500,
                ease: "Power2",
                onComplete: () => {
                  this.title.destroy();
                  this.scene.stop('notify')
                },
              });
            }, 400);
          },
        });
        break;
    }
  }
}
