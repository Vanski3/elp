class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHealth = new StatusBarHealth();
  statusBarCoin = new StatusBarCoin();
  statusBarBottle = new StatusBarBottle();
  statusBarEndboss = new StatusBarEndboss();

  enemiesToRemove = [];
  deadEnemys = false;
  throwingButtonPressed = false;
  pepeJumpedOnChicken = false;
  bottleCollisionWithEndboss = false;
  throwableObject = [];

  intervalIds = [];

  /**
   * Creates an instance of the Game class and initializes it with a canvas and keyboard input.
   *
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element used for rendering.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Sets the current world for the character.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Clears the canvas, translates based on camera position, and draws all game objects.
   * Also updates status bars and schedules the next animation frame.
   * @returns {void}
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addToMap(this.character);

    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObject);
    this.addObjectsToMap(this.level.endboss);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Runs the game loop, checking collisions, updating game state, and managing interactions periodically.
   * @returns {void}
   */
  run() {
    setInterval(() => {
      this.checkcollisions();
      this.checkcollisionsFromTop();
      this.checkCollactableCoin();
      this.checkCollactableBottle();
      this.checkThrowObject();
      this.checkBottleCollisionWithEndboss();
      this.checkBottleCollisionWithEnemy();
      this.endbossAttack();
      this.muteAll();
      this.unmuteAll();
    }, 10);
  }

  /**
   * Checks if the character is pressing the throw button and has enough bottles to throw.
   * Initiates the throwing process if conditions are met.
   * @returns {void}
   */
  checkThrowObject() {
    if (this.statusBarBottleNotEmpty()) {
      if (this.isthrowingButtonPressed()) {
        this.setThrowableObject();
        this.updateStatusbar();
        this.removeBottleFromCharacter();
      }
    }
  }

  /**
   * Checks if the character's bottle status bar is not empty (percentage >= 19).
   * @returns {boolean} True if the bottle status bar is not empty, false otherwise.
   */
  statusBarBottleNotEmpty() {
    return this.statusBarBottle.percentage >= 19;
  }

  /**
   * Checks if the throw button (B key) is pressed and the throw action is not already in progress.
   * @returns {boolean} True if the throw button is pressed and the throw action is not in progress, false otherwise.
   */
  isthrowingButtonPressed() {
    return this.keyboard.F && this.throwingButtonPressed == false;
  }

  /**
   * Initiates the creation of a throwable object (bottle) and adds it to the game world.
   * @returns {void}
   */
  setThrowableObject() {
    this.throwingButtonPressed = true;
    let bottle = new ThrowableObject(
      this.character.x + 60,
      this.character.y + 73
    );
    this.throwableObject.push(bottle);
  }

  /**
   * Updates the bottle status bar after a bottle is thrown (decreases percentage by 20).
   * @returns {void}
   */
  updateStatusbar() {
    let statusbar = this.statusBarBottle.percentage;
    statusbar -= 20;
    this.statusBarBottle.setPercentages(statusbar);
  }

  /**
   * Removes the bottle from the character's inventory after it is thrown.
   * Resets the character's idle state and stops snoring sound if playing.
   * @returns {void}
   */
  removeBottleFromCharacter() {
    this.character.removeBottle();
    this.character.idleStartTime = null;
    this.character.snoring_sound.pause();
  }

  /**
   * Checks collisions between the character and enemies on the ground.
   * Damages the character if collision occurs.
   * @returns {void}
   */
  checkcollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.isCharacterCollidingWithEnemyOnGround(enemy)) {
        this.characterGetDamage();
      }
    });
  }

  /**
   * Checks if the character jumps on top of an enemy, triggering its dying process.
   * @returns {void}
   */
  checkcollisionsFromTop() {
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (this.isCharacterJumpOnEnemy(enemy)) {
        this.enemyDyingProcess(enemy);
      }
      return true; // Keep the enemy in the array
    });
  }

  /**
   * Checks if the character is colliding with an enemy on the ground.
   * @param {Object} enemy - The enemy object to check collision with.
   * @returns {boolean} True if the character is colliding with the enemy on the ground and conditions are met, false otherwise.
   */
  isCharacterCollidingWithEnemyOnGround(enemy) {
    return (
      this.character.isColliding(enemy) &&
      !this.character.isAboveGround() &&
      this.deadEnemys == false
    );
  }

  /**
   * Damages the character and updates its health status bar after colliding with an enemy.
   * @returns {void}
   */
  characterGetDamage() {
    this.pepeJumpedOnChicken = true;
    this.character.hit("character");
    this.statusBarHealth.setPercentages(this.character.energy);
    this.pepeJumpedOnChicken = false;
  }

  /**
   * Checks if the character is jumping on top of an enemy.
   * @param {Object} enemy - The enemy object to check collision with.
   * @returns {boolean} True if the character is colliding with the enemy from above and conditions are met, false otherwise.
   */
  isCharacterJumpOnEnemy(enemy) {
    return (
      this.character.isColliding(enemy) &&
      this.character.isAboveGround() &&
      this.character.speedY < 15
    );
  }

  /**
   * Initiates the dying process of an enemy when the character jumps on top of it.
   * @param {Object} enemy - The enemy object that is dying.
   * @returns {void}
   */
  enemyDyingProcess(enemy) {
    enemy.chickenDead();
    this.deadEnemys = true;
    this.enemiesToRemove.push(enemy);
    this.removeEnemyAfterShortTime();
  }

  /**
   * Removes enemies from the level after a short delay, allowing for death animations to complete.
   * @returns {void}
   */
  removeEnemyAfterShortTime() {
    setTimeout(() => {
      this.enemiesToRemove.forEach((enemy) => {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) {
          this.level.enemies.splice(index, 1);
        }
      });
      this.deadEnemys = false;
      return false;
    }, 250);
  }

  /**
   * Checks and collects coins that the character collides with.
   * Updates character's coin count and status bar accordingly.
   * @returns {void}
   */
  checkCollactableCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.isCharacterCollectingCoin(coin)) {
        this.characterCollectCoin(coin, index);
      }
    });
  }

  /**
   * Checks if the character is colliding with a specific coin.
   * @param {Object} coin - The coin object to check collision with.
   * @returns {boolean} True if character is colliding with the coin, false otherwise.
   */
  isCharacterCollectingCoin(coin) {
    return this.character.isColliding(coin);
  }

  /**
   * Handles the collection of a coin by the character.
   * Plays coin collection sound, updates character's coin count, and removes the collected coin from the level.
   * @param {Object} coin - The coin object being collected.
   * @param {number} index - The index of the coin in the level array.
   * @returns {void}
   */
  characterCollectCoin(coin, index) {
    coin.collectCoinSound();
    this.character.collectCoin();
    this.statusBarCoin.setPercentages(this.character.coins);
    this.level.coins.splice(index, 1);
  }

  /**
   * Checks and collects bottles that the character collides with, if the bottle can be collected.
   * Updates character's bottle count and status bar accordingly.
   * @returns {void}
   */
  checkCollactableBottle() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.isCharacterCollectingBottle(bottle)) {
        if (this.isStatusBarBottleFull()) {
          bottle.noCollectAwailable();
        } else if (!this.isStatusBarBottleFull()) {
          this.characterCollectBotle(bottle, index);
        }
      }
    });
  }

  /**
   * Checks if the character is colliding with a specific bottle.
   * @param {Object} bottle - The bottle object to check collision with.
   * @returns {boolean} True if character is colliding with the bottle, false otherwise.
   */
  isCharacterCollectingBottle(bottle) {
    return this.character.isColliding(bottle);
  }

  /**
   * Handles the collection of a bottle by the character.
   * Plays bottle collection sound, updates character's bottle count, and removes the collected bottle from the level.
   * @param {Object} bottle - The bottle object being collected.
   * @param {number} index - The index of the bottle in the level array.
   * @returns {void}
   */
  characterCollectBotle(bottle, index) {
    bottle.collectBottleSound();
    this.character.collectBottle();
    this.statusBarBottle.setPercentages(this.character.bottles);
    this.level.bottles.splice(index, 1);
  }

  /**
   * Checks if the character's bottle status bar is full (100%).
   * @returns {boolean} True if the bottle status bar is full, false otherwise.
   */
  isStatusBarBottleFull() {
    return this.statusBarBottle.percentage == 100;
  }

  /**
   * Checks collisions between throwable objects (bottles) and the endboss.
   * Updates endboss's health and speed if a collision occurs.
   * @returns {void}
   */
  checkBottleCollisionWithEndboss() {
    this.throwableObject.forEach((bottle, index) => {
      if (this.isBottleCollidingEndboss(bottle)) {
        this.updateEndbossHealth(bottle, index);
        this.updateSpeedOfEndboss();
      }
    });
  }

  /**
   * Checks if a specific bottle is colliding with the endboss.
   * @param {Object} bottle - The bottle object to check collision with the endboss.
   * @returns {boolean} True if the bottle is colliding with the endboss and collision flag is false, false otherwise.
   */
  isBottleCollidingEndboss(bottle) {
    return (
      bottle.isColliding(this.level.endboss[0]) &&
      !this.bottleCollisionWithEndboss == true
    );
  }

  /**
   * Updates the endboss's health and status bar after a bottle collision.
   * Sets the collision flag to true and removes the bottle from the level.
   * @param {Object} bottle - The bottle object that collided with the endboss.
   * @param {number} index - The index of the bottle in the throwable object array.
   * @returns {void}
   */
  updateEndbossHealth(bottle, index) {
    this.bottleCollisionWithEndboss = true;
    bottle.splash();
    this.level.endboss[0].hit("endboss");
    this.statusBarEndboss.setPercentages(this.level.endboss[0].endbossEnergy);
    this.level.bottles.splice(index, 1);
  }

  /**
   * Increases the endboss's speed by 5 units.
   * @returns {void}
   */
  updateSpeedOfEndboss() {
    this.level.endboss[0].speed += 5;
  }

  /**
   * Initiates the endboss's attack on the character if they are colliding.
   * Updates character health after the attack.
   * @returns {void}
   */
  endbossAttack() {
    if (this.isCharacterCollidingWithEndboss()) {
      this.endbossAttackCharacter();
      this.updateCharacterHealth();
    } else {
      this.attackAnimationPlayed = false;
    }
  }

  /**
   * Initiates the endboss's attack animation on the character.
   * @returns {void}
   */
  endbossAttackCharacter() {
    this.level.endboss[0].attack();
  }

  /**
   * Updates the character's health after an endboss attack.
   * @returns {void}
   */
  updateCharacterHealth() {
    this.character.hit("character");
    this.statusBarHealth.setPercentages(this.character.energy);
  }

  /**
   * Checks if the character is colliding with the endboss.
   * @returns {boolean} True if collision occurs, false otherwise.
   */
  isCharacterCollidingWithEndboss() {
    return this.character.isColliding(this.level.endboss[0]);
  }

  /**
   * Checks collisions between throwable objects (bottles) and enemies.
   * Initiates enemy dying process if collision occurs.
   * @returns {void}
   */
  checkBottleCollisionWithEnemy() {
    this.throwableObject.forEach((bottle, index) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          this.enemyDyingProcess(enemy);
        }
      });
    });
  }

  /**
   * Mutes all game sounds at regular intervals if muted flag is set to true.
   * @returns {void}
   */
  muteAll() {
    setInterval(() => {
      if (muted == true) {
        this.character.snoring_sound.pause();
        background_sound.pause();
        background_sound.currentTime = 0;
        this.character.snoring_sound.currentTime = 0;
      }
    }, 500);
  }

  /**
   * Unmutes all game sounds at regular intervals if muted flag is false and last edited element is the gamescreen.
   * @returns {void}
   */
  unmuteAll() {
    setInterval(() => {
      if (
        muted == false &&
        lastEdited == document.getElementById("gamescreen")
      ) {
        background_sound.play();
        background_sound.volume = 0.4;
      }
    }, 1800);
  }

  /**
   * Adds multiple game objects to the game map for drawing.
   * @param {Array} objects - An array of game objects to add to the map.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single game object to the game map for drawing.
   * Handles flipping the image horizontally if specified.
   * @param {Object} mo - The game object to add to the map.
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx); // Draw the object
    // mo.drawFrame(this.ctx); // Draw frame if needed
    // mo.drawOffsetFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image horizontally for rendering purposes.
   * @param {Object} mo - The game object whose image should be flipped.
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save(); // Save current drawing state
    this.ctx.translate(mo.width, 0); // Translate to the right edge of the object
    this.ctx.scale(-1, 1); // Flip horizontally
    mo.x = mo.x * -1; // Adjust x-coordinate for flipped image
  }

  /**
   * Restores the normal drawing state after flipping an image.
   * @param {Object} mo - The game object whose image was flipped.
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1; // Restore original x-coordinate
    this.ctx.restore(); // Restore previous drawing state
  }
}
