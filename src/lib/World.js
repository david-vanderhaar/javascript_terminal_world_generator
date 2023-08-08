import NameGenerator from "./NameGenerator.js";
import MatrixGenerator from "./MatrixGenerator.js";
import Constants from "./constants.js";
import * as Helpers from "./helpers.js";

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
}

export default class World {
  constructor({
    theme = Constants.THEME.BLACK_WHITE,
    maxScroll = 64,
    maxZoom = 4
  }) {
    this.theme = theme;
    this._maxXyScroll = maxScroll;
    this._maxZ = maxZoom;
    this.regenerate();
  }

  regenerate() {
    this.name = this.initializeName();
    this.currentPosition = new Point(0, 0, 0);

    this.matrixMap = {
      [this.currentPosition.toString()]: this.initializeMatrix()
    };
  }

  get matrix() {
    return this.matrixMap[this.currentPosition.toString()];
  }

  getMatrix() {
    return this.matrixMap[this.currentPosition.toString()];
  }

  themedMatrix(theme) {
    return this.matrix.map(row =>
      row.map(tile => theme[tile]['character'])
    );
  }

  coloredMatrix() {
    return this.themedMatrix(this.theme);
  }

  initializeMatrix() {
    // return new MatrixGenerator().twoLandsMatrix()
    const seed = Math.random();
    return new MatrixGenerator().noiseMatrix(seed, 4);
  }

  initializeName() {
    return new NameGenerator().generate();
  }

  setName(name) {
    this.name = name;
  }

  cycleTheme() {
    const availableThemes = Constants.THEME.constants.map(theme =>
      Constants.THEME[theme]
    );

    const currentThemeIndex = availableThemes.indexOf(this.theme);
    const nextThemeIndex = (currentThemeIndex + 1) % availableThemes.length;

    this.setTheme(availableThemes[nextThemeIndex]);
  }

  setTheme(theme) {
    this.theme = theme;
  }

  draw(tileSize) {
    return this.renderMapWithInfo(tileSize);
  }

  renderMapWithInfo(tileSize) {
    return [
      this.renderMap(tileSize),
      "",
      this.worldNameDisplay(),
      this.zoomLevelDisplay(),
      this.coordinatesDisplay()
    ].join("\n");
  }

  renderMap(tileSize) {
    return this.renderMatrix(this.coloredMatrix(), this.theme, tileSize);
  }

  renderMatrix(matrixToRender, theme, tileSize) {
    return matrixToRender.map((row, y) =>
      row
        .map((tile, x) => tile)
        .join(theme[Constants.TILE_TYPES.NONE]['character'].repeat(tileSize))
    ).join("\n".repeat(tileSize));
  }

  worldNameDisplay() {
    return `You are exploring _${this.name}_`;
  }

  zoomLevelDisplay() {
    return `Zoom: ${this.currentPosition.z}`;
  }

  coordinatesDisplay() {
    return `x: ${this.currentPosition.x}, y: ${this.currentPosition.y}`;
  }

  currentMatrixWidth() {
    return this.matrix.length;
  }

  nextMatrixWidth() {
    return (this.currentMatrixWidth() * 2) - 1;
  }

  matrixExistsInPosition(position) {
    return this.matrixMap.hasOwnProperty(position.toString());
  }

  zoomIn() {
    const newPosition = this.incrementZLevel(this.currentPosition);
    if (!this.matrixExistsInPosition(newPosition)) {
      this.generateNewZoomedInMap(newPosition);
    }

    this.currentPosition = newPosition;
  }

  zoomOut() {
    const newPosition = this.decrementZLevel(this.currentPosition);
    if (!this.matrixExistsInPosition(newPosition)) {
      this.generateNewZoomedOutMap(newPosition);
    }

    this.currentPosition = newPosition;
  }

  selectMatricesAtXAndZ(matrixMap, position) {
    const selectedMatrices = {};
    for (const key in matrixMap) {
      if (this.matrixKeyMatchesXAndZ(key, position.x, position.z)) {
        selectedMatrices[key] = matrixMap[key];
      }
    }
    return selectedMatrices;
  }

  selectMatricesAtYAndZ(matrixMap, position) {
    const selectedMatrices = {};
    for (const key in matrixMap) {
      if (this.matrixKeyMatchesYAndZ(key, position.y, position.z)) {
        selectedMatrices[key] = matrixMap[key];
      }
    }
    return selectedMatrices;
  }

  matrixKeyMatchesXAndZ(matrixKey, x, z) {
    const [keyX, keyY, keyZ] = matrixKey.split(',').map(Number);
    return x === keyX && z === keyZ;
  }

  matrixKeyMatchesYAndZ(matrixKey, y, z) {
    const [keyX, keyY, keyZ] = matrixKey.split(',').map(Number);
    return y === keyY && z === keyZ;
  }

  transformMatrixKeyToPoint(key) {
    const [x, y, z] = key.split(',').map(Number);
    return new Point(x, y, z);
  }

  fillMatrixMapWith(newMatrices) {
    for (const newMatrix of newMatrices) {
      this.matrixMap[newMatrix.key] = newMatrix.value;
    }
  }

  setCurrentPosition(newPosition) {
    this.currentPosition = newPosition;
  }

  scrollRight() {
    this.scrollRightV2();
  }

  scrollLeft() {
    this.scrollLeftV2();
  }

  scrollUp() {
    this.scrollUpV2();
  }

  scrollDown() {
    this.scrollDownV2();
  }

  scrollV2(increment_position_method, matrix_selector_method, create_matrix_in_direction_method) {
    const new_position = increment_position_method(this.currentPosition);
    const matricies_to_scroll = matrix_selector_method(this.matrixMap, this.currentPosition);

    const scrolled = matricies_to_scroll.map(({ key, value }) => {
      const matrix_position = this.transformMatrixKeyToPoint(key);
      const next_position = increment_position_method(matrix_position);
      const new_key = this.matrixMap[next_position.toString()] ? null : next_position.toString();

      return {
        key: new_key,
        value: create_matrix_in_direction_method(value)
      };
    });

    const valid_scrolled = scrolled.filter(item => item.key !== null);
    this.fillMatrixMapWith(valid_scrolled);
    this.setCurrentPosition(new_position);
  }

  scrollRightV2() {
    this.scrollV2(
      this.incrementXLevel,
      this.select_matricies_at_x_and_z,
      this.get_matrix_scrolled_right
    )
  }

  scrollLeftV2() {
    this.scrollV2(
      this.decrementXLevel,
      this.select_matricies_at_x_and_z,
      this.get_matrix_scrolled_left
    )
  }

  scrollUpV2() {
    this.scrollV2(
      this.incrementYLevel,
      this.select_matricies_at_y_and_z,
      this.get_matrix_scrolled_up
    )
  }

  scrollDownV2() {
    this.scrollV2(
      this.decrementYLevel,
      this.select_matricies_at_y_and_z,
      this.get_matrix_scrolled_down
    )
  }

  incrementXLevel(position) {
    return this.addToXLevel(1, position)
  }

  decrementXLevel(position) {
    return this.addToXLevel(-1, position)
  }

  incrementYLevel(position) {
    return this.addToYLevel(1, position)
  }

  decrementYLevel(position) {
    return this.addToYLevel(-1, position)
  }

  incrementZLevel(position) {
    return this.addToZLevel(1, position)
  }

  decrementZLevel(position) {
    return this.addToZLevel(-1, position)
  }

  addToXLevel(amount, position) {
    const new_x = Helpers.clamp(position.x + amount, -this.maxX(), this.maxX())

    return new Point(new_x, position.y, position.z)
  }

  addToYLevel(amount, position) {
    const new_y = Helpers.clamp(position.y + amount, -this.maxY(), this.maxY())

    return new Point(position.x, new_y, position.z)
  }

  addToZLevel(amount, position) {
    const new_z = Helpers.clamp(position.z + amount, 0, this.maxZ())
    const zooming_out = this.isZoomingOut(amount)

    return new Point(
      zooming_out ? 0 : position.x,
      zooming_out ? 0 : position.y,
      new_z
    )
  }

  isZoomingOut(amount) {
    return amount < 0;
  }

  maxX() {
    return this.scrollable() ? this.maxXYScroll() : 0;
  }

  maxY() {
    return this.scrollable() ? this.maxXYScroll() : 0;
  }

  scrollable() {
    return this.currentPosition.z >= this.maxZ();
  }

  maxXYScroll() {
    return this._maxXyScroll;
  }

  maxZ() {
    return this._maxZ;
  }

  generateNewZoomedInMap(position) {
    const zoomLength = this.nextMatrixWidth();
    const unfilledNewMatrix = [];
    this.matrix.forEach((row, i) => {
      unfilledNewMatrix.push(this.expandedRow(zoomLength, this.matrix[i]));
      if (unfilledNewMatrix.length < zoomLength) {
        unfilledNewMatrix.push(this.newRow(zoomLength));
      }
    });

    const filledNewMatrix = this.fillNoneTiles(unfilledNewMatrix);
    this.matrixMap[position.toString()] = filledNewMatrix;
  }

  generateNewZoomedOutMap(position) {
    const newMatrix = [];
    this.matrix.forEach((row, i) => {
      if (Helpers.isEven(i)) {
        const newRow = [];
        this.matrix[i].forEach((tile, j) => {
          if (Helpers.isEven(j)) newRow.push(tile);
        });
        newMatrix.push(newRow);
      }
    });

    this.matrixMap[position.toString()] = newMatrix;
  }

  getMatrixScrolledRight(matrixToScroll) {
    const unfilledNewMatrix = this.expandMatrixRight(matrixToScroll);
    return this.fillNoneTiles(unfilledNewMatrix);
  }

  getMatrixScrolledLeft(matrixToScroll) {
    const unfilledNewMatrix = this.expandMatrixLeft(matrixToScroll);
    return this.fillNoneTiles(unfilledNewMatrix);
  }

  getMatrixScrolledUp(matrixToScroll) {
    const unfilledNewMatrix = this.expandMatrixUp(matrixToScroll);
    return this.fillNoneTiles(unfilledNewMatrix);
  }

  getMatrixScrolledDown(matrixToScroll) {
    const unfilledNewMatrix = this.expandMatrixDown(matrixToScroll);
    return this.fillNoneTiles(unfilledNewMatrix);
  }

  expandMatrixRight(matrixToExpand) {
    return matrixToExpand.map((row, y) => {
      const newRow = row.slice();
      newRow.shift();
      newRow.push(Constants.TILE_TYPES.NONE);

      return newRow;
    });
  }

  expandMatrixLeft(matrixToExpand) {
    return matrixToExpand.map((row, y) => {
      const newRow = row.slice();
      newRow.pop();
      newRow.unshift(Constants.TILE_TYPES.NONE);

      return newRow;
    });
  }

  expandMatrixUp(matrixToExpand) {
    const unfilledNewMatrix = [];
    matrixToExpand.forEach((row, i) => {
      if (i < this.currentMatrixWidth() - 1) {
        unfilledNewMatrix.push(row.slice());
      }
    });

    unfilledNewMatrix.unshift(this.newRow(this.currentMatrixWidth()));
    return unfilledNewMatrix;
  }

  expandMatrixDown(matrixToExpand) {
    const unfilledNewMatrix = [];
    matrixToExpand.forEach((row, i) => {
      if (i > 0) {
        unfilledNewMatrix.push(row.slice());
      }
    });

    unfilledNewMatrix.push(this.newRow(this.currentMatrixWidth()));
    return unfilledNewMatrix;
  }

  expandedRow(zoomLength, currentRow) {
    const newRow = [];
    currentRow.forEach((row, i) => {
      newRow.push(currentRow[i]);
      if (newRow.length < zoomLength) {
        newRow.push(Constants.TILE_TYPES.NONE);
      }
    });

    return newRow;
  }

  newRow(zoomLength) {
    return Array(zoomLength).fill(Constants.TILE_TYPES.NONE);
  }

  fillNoneTiles(unfilledMatrix) {
    const newMatrix = [];
    unfilledMatrix.forEach((row, y) => {
      const newRow = [];
      row.forEach((tile, x) => {
        let newTile = tile;
        if (tile === Constants.TILE_TYPES.NONE) {
          const neighboringTiles = this.getTilesInNeighboringPositions(x, y, unfilledMatrix);
          const filledTiles = neighboringTiles.filter(tile => ![Constants.TILE_TYPES.NONE].includes(tile));
          const randomNeighborTile = Helpers.sample(filledTiles);
          if (randomNeighborTile !== Constants.TILE_TYPES.NONE) newTile = randomNeighborTile
          else newTile = Constants.TILE_TYPES.sample()
        }

        newRow.push(newTile);
      });

      newMatrix.push(newRow);
    });

    return newMatrix;
  }

  getTilesInNeighboringPositions(x, y, currentMatrix) {
    const relativeNeighboringPositions = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
    ]

    const neighboringTiles = [];
    relativeNeighboringPositions.forEach(pos => {
      const tile = this.getTileAtPosition(x + pos.x, y + pos.y, currentMatrix);
      if (tile) neighboringTiles.push(tile);
    });

    return neighboringTiles;
  }

  getTileAtPosition(x, y, currentMatrix) {
    try {
      return currentMatrix[y][x];
    } catch (e) {
      return false;
    }
  }
}
