class Coin extends MoveableObject {
  coinCollecting_sound = new Audio("audio/coinCollected.mp3");
  animationInterval;

  offset = {
    top: 70,
    left: 20,
    right: 40,
    bottom: 35,
  };

  IMAGES_WALKING = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
  ];

  /**
   * Creates an instance of the Coin class and initializes it with images and random positions.
   *
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 350 + Math.random() * 2100;
    this.y = 70 + Math.random() * 180;
    this.animateCoin();
  }

  /**
   * Sets an interval to play the walking animation for the coin.
   * The animation changes every 750 milliseconds.
   */
  animateCoin() {
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 750);
  }

  /**
   * Plays the coin collecting sound at full volume if the sound is not muted.
   */
  collectCoinSound() {
    if (!muted) {
      this.coinCollecting_sound.volume = 1;
      this.coinCollecting_sound.play();
    }
  }
}
