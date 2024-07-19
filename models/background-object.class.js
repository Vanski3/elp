class BackgroundObject extends MoveableObject {
  width = 1440;
  height = 480;

  /**
   * Creates an instance of a class and initializes it with an image and a position.
   *
   * @constructor
   * @param {string} imagePath - The path to the image file.
   * @param {number} x - The x-coordinate for the object's position.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
