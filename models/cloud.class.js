class Cloud extends MoveableObject {
  y = 15;
  width = 575;
  height = 250;
  speed = 0.1;
  animationInterval;

  /**
   * Creates an instance of the Cloud class and initializes it with an image and a random position.
   *
   * @constructor
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = -440 + Math.random() * 2440;
    this.animate();
  }

  /**
   * Sets an interval to move the character to the left.
   * The character moves at a rate of 30 frames per second.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 30);
  }
}
