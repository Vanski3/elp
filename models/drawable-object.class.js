class DrawableObject {
  x = 80;
  y = 315;
  img;
  width = 70;
  height = 120;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads an image from the specified path and assigns it to this.img.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images from an array of paths and stores them in the imageCache property.
   * @param {string[]} arr - Array of paths to the image files.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the loaded image on the canvas context at the current position and size.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  //   drawFrame(ctx) {
  //     if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Bottle || this instanceof Endboss) {
  //       // Zeichnet nur die Rahmen von Charakter oder Chicken
  //       ctx.beginPath();
  //       ctx.lineWidth = "3";
  //       ctx.strokeStyle = "blue";
  //       ctx.rect(this.x, this.y, this.width, this.height);
  //       ctx.stroke();
  //     }
  //   }

  //   drawOffsetFrame(ctx) {
  //     if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Bottle || this instanceof Endboss) {
  //         ctx.beginPath();
  //         ctx.lineWidth = '2';
  //         ctx.strokeStyle = 'red';
  //         ctx.rect(this.x + this.offset.left, this.y + this.offset.top - this.offset.bottom, this.width - this.offset.right, this.height - this.offset.top);
  //         ctx.stroke();
  //     }
  // }
}
