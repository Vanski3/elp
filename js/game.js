let canvas;
let world;
let keyboard = new Keyboard();
let hover_sound = new Audio("audio/hoverButtons.mp3");
let click_sound = new Audio("audio/click.mp3");
let background_sound = new Audio("audio/background.mp3");
let winning_sound = new Audio("audio/winning.mp3");
let loosing_sound = new Audio("audio/loosing.mp3");
let muted = false;
let winningSoundWasPlayed = false;
let loosingSoundWasPlayed = false;

lastEdited = document.getElementById("startscreen");

window.addEventListener("resize", updateScreenWidth);
updateScreenWidth(); // Initiale Aktualisierung

/**
 * Updates the screen layout based on the window width.
 * If the window width is 650 pixels or less, certain elements are hidden
 * and styles are applied to indicate a rotated device hint.
 * Otherwise, the elements are shown and the styles are reverted.
 */
function updateScreenWidth() {
  if (window.innerWidth <= 650) {
    lastEdited.classList.add("d-none");
    document.getElementById("rotateHint").classList.remove("d-none");
    document.getElementById("rotateImage").classList.remove("d-none");
    document.getElementById("headline").classList.add("brownColor");
  } else {
    lastEdited.classList.remove("d-none");
    document.getElementById("rotateHint").classList.add("d-none");
    document.getElementById("rotateImage").classList.add("d-none");
    document.getElementById("headline").classList.remove("brownColor");
  }
}

/**
 * Pauses the game by stopping background sounds and character's snoring sound,
 * clearing all intervals, and updating the UI to show the play button.
 */
function gamePaused() {
  background_sound.pause();
  background_sound.currentTime = 0;
  world.character.snoring_sound.pause()
  clearAllIntervals();
  document.getElementById("pauseGameImg").classList.add("d-none");
  document.getElementById("playGameImg").classList.remove("d-none");
}

/**
 * Clears all active intervals.
 * This function stops all interval timers by clearing intervals from 1 to 9999.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Continues the game by playing background sounds, checking for continued game state,
 * and updating the UI to show the pause button.
 */
function gameContinued() {
  background_sound.play();
  checkContinued();
  document.getElementById("pauseGameImg").classList.remove("d-none");
  document.getElementById("playGameImg").classList.add("d-none");
}

/**
 * Checks if the game is paused. If the game is not paused, it resumes
 * various animations and actions within the game world.
 * This includes running the world, animating enemies, coins, clouds, bottles,
 * throwable objects, the end boss, and the main character. It also applies gravity to the character.
 */
function checkContinued() {
  if (this.gamePaused) {
    world.run();
    world.level.enemies.forEach((enemy) => {
      enemy.animateWalking();
    });
    world.level.enemies.forEach((enemy) => {
      enemy.animate();
    });
    world.level.coins.forEach((coin) => {
      coin.animateCoin();
    });
    world.level.clouds.forEach((cloud) => {
      cloud.animate();
    });
    world.level.bottles.forEach((bottle) => {
      bottle.animateBottle();
    });
    world.throwableObject.forEach((object) => {
      object.throw();
    });
    world.throwableObject.forEach((object) => {
      object.rotateBottle();
    });
    world.level.endboss[0].animate();
    world.character.animate();
    world.character.applyGravity();
  }
}

/**
 * Starts the game by setting up the game screen, playing a click sound, and
 * initializing the level and canvas after specified delays.
 */
function startGame() {
  lastEdited = document.getElementById("gamescreen");
  click_sound.play();
  document.getElementById("loadingscreen").classList.remove("d-none");
  document.getElementById("gamescreen").classList.remove("d-none");
  document.getElementById("headline").classList.add("d-none");
  document.getElementById("startscreen").classList.add("d-none");
  initLevelAfterWhile();
  initCanvas();
}

/**
 * Initializes the game level after a delay of 1.5 seconds.
 */
function initLevelAfterWhile() {
  setTimeout(() => {
    initLevel();
    init();
  }, 1500);
}

/**
 * Initializes the game canvas after a delay of 3.5 seconds and shows
 * necessary game controls.
 */
function initCanvas() {
  setTimeout(() => {
    showCanvas();
    document.getElementById("headline").classList.remove("d-none");
    document.getElementById("soundControl").classList.remove("d-none");
    document.getElementById("controlsForMobile").classList.remove("d-none");
  }, 3500);
}

/**
 * Sets up the game world using the canvas element and initializes the game with keyboard controls.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Displays the canvas by hiding the loading screen and showing the canvas element.
 */
function showCanvas() {
  document.getElementById("loadingscreen").classList.add("d-none");
  document.getElementById("canvas").classList.remove("d-none");
  document.getElementById("startscreen").classList.add("d-none");
}

/**
 * Plays a hover sound effect with reduced volume.
 */
function playHoverEffect() {
  if (isUserInteracted) {  // Nur abspielen, wenn der Nutzer interagiert hat
    hover_sound.volume = 0.2;
    hover_sound.play().catch((error) => {
      console.error("Audio konnte nicht abgespielt werden:", error);
    });
  }
}

// Flag zum Überwachen, ob eine Nutzerinteraktion stattgefunden hat
let isUserInteracted = false;
window.addEventListener('click', () => isUserInteracted = true); // Kann auch andere Events wie 'keydown' umfassen

/**
 * Stops the hover sound effect.
 */
function stopHoverEffect() {
  hover_sound.pause();
}

/**
 * Shows a hint by making the hint content visible.
 */
function showHint() {
  document.getElementById("hintContent").classList.remove("d-none");
}

/**
 * Hides the hint content.
 */
function leaveHint() {
  document.getElementById("hintContent").classList.add("d-none");
}

/**
 * Shows the controls screen and hides the start screen.
 */
function showControls() {
  lastEdited = document.getElementById("controlsscreen");
  click_sound.play();
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("controlsscreen").classList.remove("d-none");
}

/**
 * Returns to the start screen from the controls screen.
 */
function backToStartscreen() {
  lastEdited = document.getElementById("startscreen");
  click_sound.play();
  document.getElementById("startscreen").classList.remove("d-none");
  document.getElementById("controlsscreen").classList.add("d-none");
}

/**
 * Displays the end screen upon game completion, mutes the game sounds,
 * and plays the winning animation and sound.
 */
function playEndScreen() {
  muted = true;
  document.getElementById("gamescreen").classList.add("d-none");
  document.getElementById("winningscreen").classList.remove("d-none");
  document.getElementById("wonImg").classList.add("animateImgWin");
  playWinningSound();
}

/**
 * Plays the winning sound with a delay, if it hasn't been played already.
 */
function playWinningSound() {
  setTimeout(() => {
    if (!winningSoundWasPlayed) {
      winning_sound.play();
      winning_sound.volume = 0.5;
      winningSoundWasPlayed = true;
    }
  }, 200);
}

/**
 * Displays the game over screen, mutes the game sounds,
 * and plays the losing animation and sound.
 */
function playGameOverScreen() {
  muted = true;
  document.getElementById("gamescreen").classList.add("d-none");
  document.getElementById("loosingscreen").classList.remove("d-none");
  document.getElementById("looseImg").classList.add("animateImgLoose");
  playLoosingSound();
}

/**
 * Plays the losing sound with a delay, if it hasn't been played already.
 */
function playLoosingSound() {
  setTimeout(() => {
    if (!loosingSoundWasPlayed) {
      loosing_sound.play();
      loosingSoundWasPlayed = true;
    }
  }, 200);
}

/**
 * Returns to the start screen after playing a click sound and reloading the page.
 */
function backToStartscreen() {
  click_sound.play();
  setTimeout(() => {
    location.reload();
  }, 200);
}

/**
 * Mutes the game sounds, plays a click sound,
 * and updates the sound control icons.
 */
function muteSound() {
  muted = true;
  click_sound.play();
  document.getElementById("soundOnImg").classList.add("d-none");
  document.getElementById("soundOffImg").classList.remove("d-none");
}

/**
 * Unmutes the game sounds, plays a click sound,
 * and updates the sound control icons.
 */
function unmuteSound() {
  muted = false;
  click_sound.play();
  document.getElementById("soundOnImg").classList.remove("d-none");
  document.getElementById("soundOffImg").classList.add("d-none");
}

/**
 * Opens the imprint screen and hides the menu screen,
 * playing a click sound in the process.
 */
function openImprint() {
  click_sound.play();
  document.getElementById("menuscreen").classList.add("d-none");
  document.getElementById("imprintscreen").classList.remove("d-none");
}

/**
 * Opens the data protection screen and hides the menu screen,
 * playing a click sound in the process.
 */
function openDataProtection() {
  click_sound.play();
  document.getElementById("menuscreen").classList.add("d-none");
  document.getElementById("dataProtectionscreen").classList.remove("d-none");
}

/**
 * Opens the information card screen and hides the start screen,
 * playing a click sound in the process.
 */
function openInformationCard() {
  lastEdited = document.getElementById("informationscreen");
  click_sound.play();
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("informationscreen").classList.remove("d-none");
}

/**
 * Returns to the information screen from various sub-screens,
 * playing a click sound and showing the menu screen while hiding the respective sub-screen.
 * @param {string} value - The identifier for the sub-screen to hide ("imprint", "data", or "about").
 */
function backToInformationScreen(value) {
  lastEdited = document.getElementById("informationscreen");
  click_sound.play();
  if (value === "imprint") {
    document.getElementById("menuscreen").classList.remove("d-none");
    document.getElementById("imprintscreen").classList.add("d-none");
  } else if (value === "data") {
    document.getElementById("menuscreen").classList.remove("d-none");
    document.getElementById("dataProtectionscreen").classList.add("d-none");
  } else if (value === "about") {
    document.getElementById("menuscreen").classList.remove("d-none");
    document.getElementById("aboutTheGamescreen").classList.add("d-none");
  }
}

/**
 * Opens the "About the Game" screen and hides the menu screen,
 * playing a click sound in the process.
 */
function openAboutTheGame() {
  click_sound.play();
  document.getElementById("menuscreen").classList.add("d-none");
  document.getElementById("aboutTheGamescreen").classList.remove("d-none");
}


window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 37:
    case 65:
      keyboard.LEFT = true;
      break;
    case 38:
    case 87:
      keyboard.UP = true;
      break;
    case 39:
    case 68:
      keyboard.RIGHT = true;
      break;
    case 40:
    case 83:
      keyboard.DOWN = true;
      break;
    case 70:
      keyboard.F = true;
      break;
    case 32:
      keyboard.SPACE = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 37:
    case 65:
      keyboard.LEFT = false;
      break;
    case 38:
    case 87:
      keyboard.UP = false;
      break;
    case 39:
    case 68:
      keyboard.RIGHT = false;
      break;
    case 40:
    case 83:
      keyboard.DOWN = false;
      break;
    case 70:
      keyboard.F = false;
      break;
    case 32:
      keyboard.SPACE = false;
      break;
  }
});

document.getElementById("btnLeft").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  keyboard.LEFT = true;
});

document.getElementById("btnLeft").addEventListener("pointerup", (e) => {
  e.preventDefault();
  keyboard.LEFT = false;
});

document.getElementById("btnRight").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  keyboard.RIGHT = true;
});

document.getElementById("btnRight").addEventListener("pointerup", (e) => {
  e.preventDefault();
  keyboard.RIGHT = false;
});

document.getElementById("jump").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  keyboard.SPACE = true;
});

document.getElementById("jump").addEventListener("pointerup", (e) => {
  e.preventDefault();
  keyboard.SPACE = false;
});

document.getElementById("bottleThrow").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  keyboard.F = true;
});

document.getElementById("bottleThrow").addEventListener("pointerup", (e) => {
  e.preventDefault();
  keyboard.F = false;
});


/**
 * Function to reset bottles in the game.
 * @param {number} amount - The number of bottles to generate.
 */
function resetBottles(amount) {
  world.level.bottles = []; // Clear the current list of bottles
  for (let i = 0; i < amount; i++) {
    let bottle = new Bottle();
    world.level.bottles.push(bottle); // Add new bottles
  }
}

/**
 * Function to reset chickens in the game.
 * @param {number} amount - The number of chickens to generate.
 */
function resetChickens(amount) {
  world.level.enemies = []; // Clear the current list of enemies (including chickens)
  for (let i = 0; i < amount; i++) {
    let chicken = new Chicken();
    world.level.enemies.push(chicken); // Add new chickens
  }

  for (let i = 0; i < Math.floor(amount / 2); i++) { // Example: Half of the chickens are small chickens
    let smallChicken = new ChickenSmall();
    world.level.enemies.push(smallChicken);
  }
}

function stopAllSounds() {
  // Pause and reset the background music
  if (background_sound) {
    background_sound.pause();
    background_sound.currentTime = 0;
  }

  // Pause and reset hover, click, winning, and losing sounds
  if (hover_sound) {
    hover_sound.pause();
    hover_sound.currentTime = 0;
  }
  if (click_sound) {
    click_sound.pause();
    click_sound.currentTime = 0;
  }
  if (winning_sound) {
    winning_sound.pause();
    winning_sound.currentTime = 0;
  }
  if (loosing_sound) {
    loosing_sound.pause();
    loosing_sound.currentTime = 0;
  }

  // Pause all enemy sounds, especially Endboss sounds
  if (world && world.level && world.level.enemies) {
    world.level.enemies.forEach((enemy) => {
      if (enemy.endbossSound) {
        enemy.endbossSound.pause();
        enemy.endbossSound.currentTime = 0;
      }
    });
  }

  // Pause all bottle-related sounds
  if (world && world.level && world.level.bottles) {
    world.level.bottles.forEach((bottle) => {
      if (bottle.bottleCollecting_sound) {
        bottle.bottleCollecting_sound.pause();
        bottle.bottleCollecting_sound.currentTime = 0;
      }
      if (bottle.bottleBarFull_sound) {
        bottle.bottleBarFull_sound.pause();
        bottle.bottleBarFull_sound.currentTime = 0;
      }
    });
  }

  // Stop any character or other object-related sounds
  if (world && world.character) {
    if (world.character.snoring_sound) {
      world.character.snoring_sound.pause();
      world.character.snoring_sound.currentTime = 0;
    }
  }
}

/**
 * Stops all running animations in the game, such as enemies, objects, etc.
 */
function stopAllAnimations() {
  if (world && world.level) {
    // Stop animations for all enemies
    world.level.enemies.forEach((enemy) => {
      if (enemy.animationInterval) {
        clearInterval(enemy.animationInterval);
      }
    });

    // Stop animations for bottles
    world.level.bottles.forEach((bottle) => {
      if (bottle.animationInterval) {
        clearInterval(bottle.animationInterval);
      }
    });

    // Stop animations for throwable objects
    world.throwableObject.forEach((object) => {
      if (object.animationInterval) {
        clearInterval(object.animationInterval);
      }
    });

    // Stop any additional character animations
    if (world.character.animationInterval) {
      clearInterval(world.character.animationInterval);
    }
  }
}

function resetGame() {
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);

  // Stop all sounds and animations
  stopAllSounds();
  clearAllIntervals(); // Make sure all intervals are cleared
  stopAllAnimations(); // Ensure all animations are stopped

  // Reset status bars
  world.statusBarHealth.setPercentages(100);
  world.statusBarCoin.setPercentages(0);
  world.statusBarBottle.setPercentages(0);
  world.statusBarEndboss.setPercentages(100);

  // Reset bottles and chickens
  resetBottles(7);
  resetChickens(6);

  // Hide losing screen and show game screen
  document.getElementById("loosingscreen").classList.add("d-none");
  document.getElementById("gamescreen").classList.remove("d-none");

  muted = false;
  loosingSoundWasPlayed = false;

  // Initialize and run the game
  initLevel();
  world.run(); // Start the game world

  // Restart the character animations and gravity immediately
  world.character.applyGravity(); // Restart gravity for character
  world.character.animate(); // Restart character animation

  // Restart animations for other elements like enemies and bottles immediately
  world.level.enemies.forEach((enemy) => {
    enemy.animateWalking(); // Restart walking animation for enemies
  });
  world.level.bottles.forEach((bottle) => {
    bottle.animateBottle(); // Restart bottle animation
  });

  // Ensure the Endboss animation starts immediately after the reset
  if (world.level.endboss && world.level.endboss.length > 0) {
    world.level.endboss[0].animate(); // Restart Endboss animation
  }

  // Play background music without delay
  if (!muted) {
    background_sound.currentTime = 0; // Reset the background music
    background_sound.play(); // Play the background music immediately
  }
}

