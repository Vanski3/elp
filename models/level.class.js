class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  endboss;
  level_end_x = 2800;

  /**
   * Creates an instance of the Game class and initializes it with various game elements.
   *
   * @constructor
   * @param {Array} enemies - The array of enemy objects.
   * @param {Object} endboss - The endboss object.
   * @param {Array} clouds - The array of cloud objects.
   * @param {Array} backgroundObjects - The array of background objects.
   * @param {Array} coins - The array of coin objects.
   * @param {Array} bottles - The array of bottle objects.
   */
  constructor(enemies, endboss, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
    this.endboss = endboss;
  }
}
