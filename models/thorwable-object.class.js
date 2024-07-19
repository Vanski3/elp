class ThrowableObject extends MoveableObject {
  throwableObject;
  releaseGravityIntrerval;
  cracking_sound = new Audio("audio/bottleCracked.mp3");

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  IMAGES_ROTATE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Creates an instance of the SalsaBottle class and initializes it with images, position, and actions.
   *
   * @constructor
   * @param {number} x - The x-coordinate for the salsa bottle's position.
   * @param {number} y - The y-coordinate for the salsa bottle's position.
   */
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_SPLASH);
    this.loadImages(this.IMAGES_ROTATE);
    this.x = x;
    this.y = y;
    this.height = 70;
    this.throw();
    this.rotateBottle();
  }

  /**
   * Throws a bottle based on the character's direction (left or right).
   * Initiates bottle throwing animation and trajectory.
   */
  throw() {
    if (this.isCharacterLookingLeft()) {
      this.throwBottleToLeft();
    } else {
      this.throwBottleToRight();
    }
    setTimeout(() => {
      world.throwingButtonPressed = false;
    }, 1500);
  }

  /**
   * Checks if the character is looking left.
   * @returns {boolean} True if the character is looking left, otherwise false.
   */
  isCharacterLookingLeft() {
    return world.character.otherDirection;
  }

  /**
   * Throws the bottle to the left with specific initial conditions and animation.
   */
  throwBottleToLeft() {
    this.x = this.x - 90;
    this.y = this.y - 35;
    this.speedY = 16;
    this.applyGravity();
    this.throwableObject = setInterval(() => {
      this.rotateBottle();
      this.x -= 18;
    }, 30);
    this.releaseGravity();
  }

  /**
   * Throws the bottle to the right with specific initial conditions and animation.
   */
  throwBottleToRight() {
    this.speedY = 16;
    this.applyGravity();
    this.throwableObject = setInterval(() => {
      this.rotateBottle();
      this.x += 18;
    }, 30);
    this.releaseGravity();
  }

  /**
   * Initiates the rotation animation of the bottle.
   */
  rotateBottle() {
    this.playAnimation(this.IMAGES_ROTATE);
  }

  /**
   * Releases the bottle from gravity.
   * Monitors the bottle's descent and triggers splash effect upon impact.
   */
  releaseGravity() {
    this.releaseGravityIntrerval = setInterval(() => {
      if (this.y >= 360) {
        this.y = 365;
        this.speedY = 0;
        clearInterval(this.throwableObject);
        this.splash();
      }
    }, 25);
  }

  /**
   * Initiates the splash animation and sound effect upon bottle impact.
   * Removes the bottle from the map after a delay.
   */
  splash() {
    this.speedY = 0;
    this.clearBottleInterval();
    this.playAnimation(this.IMAGES_SPLASH);
    if (!muted) {
      this.cracking_sound.play();
    }
    this.removeBottleOfMap();
  }

  /**
   * Clears all intervals related to bottle animations and gravity.
   */
  clearBottleInterval() {
    clearInterval(this.throwableObject);
    clearInterval(this.releaseGravityIntrerval);
    clearInterval(this.applyGravityInterval);
  }

  /**
   * Removes the bottle from the world after a short delay.
   */
  removeBottleOfMap() {
    setTimeout(() => {
      world.throwableObject.splice(0, 1);
      world.bottleCollisionWithEndboss = false;
    }, 225);
  }
}
