
import Constants from './constants.js';
import World from './World.js';

class Display {
    constructor(screenSize) {
      this.screenSize = screenSize;
      this.world = this.initializeWorld();
    }

    draw() {
      return this.world.draw(this.tileSize());
    }

    getScreenSize() {
      return this.screenSize;
    }

    setScreenSize(value) {
      this.screenSize = value;
    }

    tileSize() {
      return 1;
      // return this.screenSize / this.world.currentMatrixWidth;
    }

    initializeWorld() {
      return new World(Constants.THEME.BLACK_WHITE);
    }

    // world() {
    //   return this.world;
    // }

    // set world(value) {
    //   this.world = value;
    // }
}

export default Display;