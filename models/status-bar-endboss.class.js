class StatusBarEndboss extends DrawableObject {
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  /**
   * Creates an instance of the EndbossContainer class and initializes it with images and dimensions.
   *
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS);
    this.setPercentages(100);
    this.x = 500;
    this.y = 16;
    this.width = 200;
    this.height = 55;
  }

  /**
   * Sets the percentage and updates the image of the endboss based on the percentage value.
   * @param {number} percentage - The percentage value to set (0 to 100).
   */
  setPercentages(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index based on the current percentage value.
   * @returns {number} The index of the image in IMAGES_ENDBOSS array based on percentage categories:
   * - 100: Index 5
   * - 80-99: Index 4
   * - 60-79: Index 3
   * - 40-59: Index 2
   * - 20-39: Index 1
   * - 0-19: Index 0
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 79) {
      return 4;
    } else if (this.percentage > 59) {
      return 3;
    } else if (this.percentage > 39) {
      return 2;
    } else if (this.percentage > 19) {
      return 1;
    } else {
      return 0;
    }
  }
}
