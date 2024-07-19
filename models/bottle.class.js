class Bottle extends MoveableObject {
  height = 70;
  y = 365;
  bottleCollecting_sound = new Audio("audio/bollteCollected.mp3");
  bottleBarFull_sound = new Audio("audio/noBottleCollect.mp3");
  animationInterval;

  offset = {
    top: 10,
    left: 20,
    right: 30,
    bottom: 0,
  };

  IMAGES_Bottle_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates an instance of the Bottle class and initializes it with an image and a random position.
   *
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_Bottle_GROUND[0]);
    this.loadImages(this.IMAGES_Bottle_GROUND);
    this.x = 250 + Math.random() * 1900;
    this.animateBottle();
  }

  /**
   * Animates the bottle by setting an interval to play the bottle ground animation.
   * The animation plays every 1.2 seconds.
   */
  animateBottle() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_Bottle_GROUND);
    }, 1200);
  }

  /**
   * Plays the bottle collecting sound if the sound is not muted.
   */
  collectBottleSound() {
    if (!muted) {
      this.bottleCollecting_sound.play();
    }
  }

  /**
   * Plays the sound indicating no bottles can be collected if the sound is not muted.
   */
  noCollectAwailable() {
    if (!muted) {
      this.bottleBarFull_sound.play();
    }
  }
}
