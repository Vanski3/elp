class MoveableObject extends DrawableObject {
  speed = 0.2;
  speedY = 0;
  acceleration = 1;
  otherDirection = false;
  energy = 100;
  endbossEnergy = 100;
  coins = 0;
  bottles = 0;
  lastHit = 0;
  applyGravityInterval;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Increases the coins count by 20.
   */
  collectCoin() {
    this.coins += 20;
  }

  /**
   * Increases the bottles count by 20.
   */
  collectBottle() {
    this.bottles += 20;
  }

  /**
   * Decreases the bottles count by 20.
   */
  removeBottle() {
    this.bottles -= 20;
  }

  /**
   * Handles a hit event based on the identification parameter.
   * @param {string} identification - The identifier for the hit target ('endboss' or 'character').
   */
  hit(identification) {
    if (identification == "endboss") {
      this.hitEndboss();
    } else if (identification == "character") {
      this.hitCharacter();
    }
  }

  /**
   * Handles a hit event on the endboss.
   * Reduces endboss energy by 20. If energy drops to 0, sets it to 0; otherwise records the last hit time.
   */
  hitEndboss() {
    this.endbossEnergy -= 20;
    if (this.endbossEnergy <= 0) {
      this.endbossEnergy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Handles a hit event on the character.
   * Reduces character energy by 3. If energy drops to 0, sets it to 0; otherwise records the last hit time.
   */
  hitCharacter() {
    this.energy -= 3;
    if (this.energy <= 15) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the character or endboss has been hurt recently.
   * @returns {boolean} True if hurt within the last 0.5 seconds, otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.5;
  }

  /**
   * Checks if the character is dead (energy equals 0).
   * @returns {boolean} True if the character is dead, otherwise false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if the endboss is dead (endboss energy equals 0).
   * @returns {boolean} True if the endboss is dead, otherwise false.
   */
  isEndbossDead() {
    return this.endbossEnergy == 0;
  }

  /**
   * Checks if this object is colliding with another object (mo).
   * @param {Object} mo - The other object to check collision with.
   * @returns {boolean} True if colliding, otherwise false.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Applies gravity to the object, moving it downwards until it reaches the ground.
   * Uses an interval to simulate gravity effects.
   */
  applyGravity() {
    this.applyGravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  /**
   * Checks if the object is above the ground level.
   * @returns {boolean} True if the object is above the ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y <= 189; // Adjust this value based on actual ground level in the game
    }
  }

  /**
   * Plays the next animation frame from the provided images array.
   * @param {string[]} images - Array of image paths to animate through.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Initiates a jump action by setting the vertical speed.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Moves the object to the right based on its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left based on its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the endboss object to the left based on its speed.
   */
  moveEndbossLeft() {
    this.x -= this.speed;
  }
}
