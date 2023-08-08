
import Constants from './constants.js';
import World from './World.js';

class Display {
    constructor({
      tileSize = 1,
      theme = Constants.THEME.DEFAULT,
      maxZoom = 10,
      maxScroll = 64
    }) {
      this._tileSize = tileSize;
      this.theme = theme;
      this.maxZoom = maxZoom;
      this.maxScroll = maxScroll;
      this._world = this.initializeWorld();
    }

    get world() {
      return this._world;
    }

    set world(value) {
      this._world = value;
    }

    get tileSize() {
      return this._tileSize;
    }

    set tileSize(value) {
      this._tileSize = value;
    }

    draw() {
      return this.world.draw(this.tileSize);
    }

    initializeWorld() {
      return new World({
        theme: Constants.THEME[this.theme],
        maxZoom: this.maxZoom,
        maxScroll: this.maxScroll,
      });
    }
}

export default Display;