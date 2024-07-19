class Character extends MoveableObject {
  height = 250;
  width = 100;
  y = 190;
  speed = 6;
  world;
  idleStartTime = null;
  deadAnimationPlayed = false;
  now;

  animationInterval;
  movingInterval;

  walking_sound = new Audio("audio/walking.mp3");
  snoring_sound = new Audio("audio/snoring.mp3");
  jumping_sound = new Audio("audio/jump.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");

  offset = {
    top: 100,
    left: 15,
    right: 30,
    bottom: 10,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD_ANIMATION = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_DEAD_LAST = ["img/2_character_pepe/5_dead/D-57.png"];

  /**
   * Creates an instance of the Character class and initializes it with images, animations, and gravity.
   *
   * @constructor
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD_ANIMATION);
    this.loadImages(this.IMAGES_DEAD_LAST);
    this.applyGravity();
    this.animate();
  }

  /**
   * Sets intervals for character movement and animation.
   * The character moves at a rate of 60 frames per second and the animation changes every 150 milliseconds.
   */
  animate() {
    this.movingInterval = setInterval(() => this.moveCharacter(), 1000 / 60);
    this.animationInterval = setInterval(() => this.playCharacter(), 150);
  }

  /**
   * Moves the character based on user input and adjusts the camera position.
   * Pauses the walking sound when not moving.
   */
  moveCharacter() {
    this.walking_sound.pause();
    if (this.canMoveRight() && this.isBeforeEndboss()) {
      this.moveRight();
    }
    if (this.canMoveLeft()) {
      this.moveLeft();
    }
    if (this.canJump()) {
      this.jump();
    }
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Checks if the character can move right.
   * @returns {boolean} - True if the right arrow key is pressed and the character has not reached the end of the level.
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x <= this.world.level.level_end_x;
  }

  /**
   * Checks if the character is before the end boss.
   * @returns {boolean} - True if the right arrow key is pressed and the character has not reached the end boss.
   */
  isBeforeEndboss() {
    return this.world.keyboard.RIGHT && this.x <= this.world.level.endboss[0].x;
  }

  /**
   * Moves the character to the right, plays the walking sound, and pauses the snoring sound.
   * Sets the character's direction to right if the end boss is dead.
   */
  moveRight() {
    if (this.isEndbossDead()) {
      super.moveRight();
      this.otherDirection = false;
    }
    if (!muted) {
      this.walking_sound.play();
    }
    this.snoring_sound.pause();
  }

  /**
   * Checks if the end boss is dead.
   * @returns {boolean} - True if the end boss's death animation has not been played.
   */
  isEndbossDead() {
    return !this.world.level.endboss[0].deadAnimationPlayed;
  }

  /**
   * Checks if the character can move left.
   * @returns {boolean} - True if the left arrow key is pressed and the character's position is greater than 0.
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Moves the character to the left, plays the walking sound, and pauses the snoring sound.
   * Sets the character's direction to left if the end boss is dead.
   */
  moveLeft() {
    if (this.isEndbossDead()) {
      super.moveLeft();
      this.otherDirection = true;
    }
    if (!muted) {
      this.walking_sound.play();
    }
    this.snoring_sound.pause();
  }

  /**
   * Checks if the character can jump.
   * @returns {boolean} - True if the up arrow or space key is pressed and the character is not above ground.
   */
  canJump() {
    return (
      (this.world.keyboard.UP && !this.isAboveGround()) ||
      (this.world.keyboard.SPACE && !this.isAboveGround())
    );
  }

  /**
   * Makes the character jump and plays the jumping sound if the end boss is dead.
   */
  jump() {
    if (this.isEndbossDead()) {
      super.jump();
    }
    if (!muted) {
      this.jumping_sound.play();
    }
  }

  /**
   * Plays the appropriate character animation based on the character's state.
   */
  playCharacter() {
    if (this.isHurt()) {
      this.getHurt();
    } else if (this.isDead()) {
      this.playDeadSequence();
    } else if (this.isAboveGround()) {
      this.playJumping();
    } else if (this.isMoving()) {
      this.playMoving();
    } else if (!this.isMoving()) {
      this.playIdle();
    }
  }

  /**
   * Plays the hurt animation and sound if the character is hurt.
   */
  getHurt() {
    this.playAnimation(this.IMAGES_HURT);
    if (!muted) {
      this.hurt_sound.play();
    }
  }

  /**
   * Plays the dead animation sequence. If the dead animation has already been played,
   * plays the last dead animation frame and shows the game over screen after a delay.
   */
  playDeadSequence() {
    if (!this.deadAnimationPlayed) {
      this.playAnimation(this.IMAGES_DEAD_ANIMATION);
      this.deadAnimationPlayed = true;
    } else {
      this.playAnimation(this.IMAGES_DEAD_LAST);
      setTimeout(() => {
        playGameOverScreen();
        this.world = null;
      }, 500);
    }
  }

  /**
   * Plays the jumping animation and pauses the snoring sound if the character is above ground.
   */
  playJumping() {
    this.playAnimation(this.IMAGES_JUMPING);
    this.idleStartTime = null;
    this.snoring_sound.pause();
  }

  /**
   * Checks if the character is moving.
   * @returns {boolean} - True if the right or left arrow key is pressed.
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Plays the walking animation if the character is moving.
   */
  playMoving() {
    this.idleStartTime = null;
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Plays the idle animation or the long idle (snoring) animation if the character is idle for more than 6 seconds.
   * Tracks the idle start time.
   */
  playIdle() {
    this.now = Date.now();
    if (this.idleStartTime === null) {
      this.idleStartTime = this.now;
    }
    const idleDuration = this.now - this.idleStartTime;
    if (idleDuration >= 6000) {
      this.playSnoring();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Plays the long idle (snoring) animation and sound if the sound is not muted.
   */
  playSnoring() {
    this.playAnimation(this.IMAGES_LONG_IDLE);
    if (!muted) {
      this.snoring_sound.play();
    }
  }
}
