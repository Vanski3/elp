class Endboss extends MoveableObject {
  height = 360;
  width = 190;
  y = 100;
  speed = 5;
  deadAnimationPlayed = false;
  attackAnimationPlayed = false;
  animationInterval;
  attack_sound = new Audio("audio/endbossAttack.mp3");
  chickenDead_sound = new Audio("audio/chickenDead.mp3");
  endbossHurt_sound = new Audio("audio/endbossHurt.mp3");

  offset = {
    top: 60,
    left: 35,
    right: 30,
    bottom: 0,
  };

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_DEAD_ANIMATION = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  IMAGES_DEAD_LAST = ["img/4_enemie_boss_chicken/5_dead/G26.png"];

  /**
   * Creates an instance of the Enemy class and initializes it with images and animations.
   *
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD_ANIMATION);
    this.loadImages(this.IMAGES_DEAD_LAST);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2900;
    this.animate();
  }

  /**
   * Sets an interval to control the animation behavior of the endboss character.
   * Determines which animation sequence to play based on the character's state.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isEndbossDead()) {
        this.endbossDead();
      } else if (this.isHurt()) {
        this.endbossHurt();
      } else if (this.sawCharacter()) {
        this.endbossWalk();
      } else if (!this.isHurt() && this.endbossDetectedPepe == false) {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 200);
  }

  /**
   * Calculates the horizontal distance between the endboss and the character.
   * @returns {number} The calculated distance.
   */
  calculatedDistance() {
    let distance = this.x - world.character.x;
    return distance;
  }

  /**
   * Checks if the character is within a certain distance range to the endboss.
   * @returns {boolean} True if the character is within the range, otherwise false.
   */
  sawCharacter() {
    return this.calculatedDistance() <= 580;
  }

  /**
   * Initiates the dead animation sequence for the endboss.
   * If the dead animation has already played, plays the final dead image.
   */
  endbossDead() {
    if (!this.deadAnimationPlayed) {
      this.playDeadAnimation();
    } else {
      this.playLastDeadImage();
    }
  }

  /**
   * Plays the initial dead animation and triggers associated sounds.
   */
  playDeadAnimation() {
    if (!muted) {
      this.chickenDead_sound.play();
    }
    this.deadAnimationPlayed = true;
    this.playAnimation(this.IMAGES_DEAD_ANIMATION);
    setTimeout(() => {}, 1000); // Placeholder for any additional actions after animation
  }

  /**
   * Plays the final dead image of the endboss and initiates the end screen after a delay.
   */
  playLastDeadImage() {
    this.playAnimation(this.IMAGES_DEAD_LAST);
    setTimeout(() => {
      playEndScreen();
    }, 1500);
  }

  /**
   * Initiates the hurt animation sequence for the endboss.
   * Plays the hurt animation and associated sounds.
   */
  endbossHurt() {
    this.playAnimation(this.IMAGES_HURT);
    if (!muted) {
      this.endbossHurt_sound.play();
    }
  }

  /**
   * Initiates the attack animation sequence for the endboss.
   * If the attack animation is not already playing, starts it and triggers attack sounds.
   */
  attack() {
    if (!this.attackAnimationPlayed) {
      this.playAttackAnimation();
    }
  }

  /**
   * Plays the attack animation sequence for the endboss and triggers attack sounds.
   * Sets a timeout to reset the attack animation state after a specified duration.
   */
  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
    if (!muted) {
      this.attack_sound.play();
    }

    setTimeout(() => {
      this.attackAnimationPlayed = false;
    }, 1000);
  }

  /**
   * Initiates the walking animation sequence for the endboss.
   * Moves the endboss to the left and plays the walking animation.
   */
  animateWalking() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Moves the endboss to the left and initiates the walking animation.
   * Sets a flag to indicate that the endboss has detected the character.
   */
  endbossWalk() {
    this.endbossDetectedPepe = true;
    this.moveLeft();
    this.animateWalking();
  }
}
