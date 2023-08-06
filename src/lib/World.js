// require 'debug'
// require 'tty-table'
// require 'tty-box'
// require_relative './constants/tile_types.rb'
// require_relative './constants/themes/black_white.rb'
import NameGenerator from "./NameGenerator.js";
import MatrixGenerator from "./MatrixGenerator.js";
import Constants from "./constants.js";

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
  constructor(theme) {
    this.theme = theme;
    this.regenerate();
  }

  regenerate() {
    this.name = this.initializeName();
    this.matrix = this.initializeMatrix();
    this.currentPosition = new Point(0, 0, 0);

    this.matrixMap = {
      [this.currentPosition.toString()]: this.matrix
    };
  }

  getMatrix() {
    return this.matrixMap[this.currentPosition.toString()];
  }

  themedMatrix(theme) {
    return this.matrix.map(row =>
      row.map(tile => theme[tile]['character'] )
    );
  }

  coloredMatrix() {
    return this.themedMatrix(this.theme);
  }

  initializeMatrix() {
    return new MatrixGenerator().twoLandsMatrix()
    // return new MatrixGenerator().perlinMatrix(4);
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
    console.log(this.renderMapWithInfo(tileSize));
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

  renderMatrix(matrixToRender, theme, tileSize) {
    return matrixToRender.map((row, y) =>
      row
        .map((tile, x) => tile)
        .join(theme[Constants.TILE_TYPES.NONE]['character'].repeat(tileSize))
    ).join("\n".repeat(tileSize));
  }

  renderMap(tileSize) {
    return this.renderMatrix(this.coloredMatrix(), this.theme, tileSize);
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
}

// to be converted from ruby to js
// def scroll_v2(
//   increment_position_method,
//   matrix_selector_method, 
//   create_matrix_in_direction_method
// )
//   new_position = method(increment_position_method).call(@current_position)
//   new_x = new_position.x

//   matricies_to_scroll = method(matrix_selector_method).call(
//       @matrix_map,
//       @current_position
//   )

//   scrolled = matricies_to_scroll.map do |key, value|
//       matrix_position = transform_matrix_key_to_point(key)
//       next_position = method(increment_position_method).call(matrix_position)
//       new_key = @matrix_map[next_position.to_s]
//           .nil? ? next_position.to_s : nil

//       {
//           key: new_key, 
//           value: method(create_matrix_in_direction_method).call(value)
//       }
//   end

//   valid_scrolled = scrolled.reject{|item| item[:key].nil?}
//   fill_matrix_map_with(valid_scrolled)
//   set_current_position(new_position)
// end

// def scroll_right_v2
//   scroll_v2(
//       :increment_x_level,
//       :select_matricies_at_x_and_z,
//       :get_matrix_scrolled_right
//   )
// end

// def scroll_left_v2
//   scroll_v2(
//       :decrement_x_level,
//       :select_matricies_at_x_and_z,
//       :get_matrix_scrolled_left
//   )
// end

// def scroll_up_v2
//   scroll_v2(
//       :increment_y_level,
//       :select_matricies_at_y_and_z,
//       :get_matrix_scrolled_up
//   )
// end

// def scroll_down_v2
//   scroll_v2(
//       :decrement_y_level,
//       :select_matricies_at_y_and_z,
//       :get_matrix_scrolled_down
//   )
// end

// def scroll_right_v1
//   new_position = increment_x_level(@current_position)
//   if !matrix_exists_in_position(new_position)
//       generate_new_scrolled_right_map(new_position)
//   end

//   @current_position = new_position
// end

// def scroll_left_v1
//   new_position = decrement_x_level(@current_position)
//   if !matrix_exists_in_position(new_position)
//       generate_new_scrolled_left_map(new_position)
//   end

//   @current_position = new_position
// end

// def scroll_up_v1
//   new_position = increment_y_level(@current_position)
//   if !matrix_exists_in_position(new_position)
//       generate_new_scrolled_up_map(new_position)
//   end

//   @current_position = new_position
// end

// def scroll_down_v1
//   new_position = decrement_y_level(@current_position)
//   if !matrix_exists_in_position(new_position)
//       generate_new_scrolled_down_map(new_position)
//   end

//   @current_position = new_position
// end

// def increment_x_level(position)
//   add_to_x_level(1, position)
// end

// def decrement_x_level(position)
//   add_to_x_level(-1, position)
// end

// def increment_y_level(position)
//   add_to_y_level(1, position)
// end

// def decrement_y_level(position)
//   add_to_y_level(-1, position)
// end

// def increment_z_level(position)
//   add_to_z_level(1, position)
// end

// def decrement_z_level(position)
//   add_to_z_level(-1, position)
// end

// def add_to_x_level(amount, position)
//   new_x = (position.x + amount).clamp(-max_x, max_x)
  
//   Point.new(
//       new_x,
//       position.y,
//       position.z,
//   )
// end

// def add_to_y_level(amount, position)
//   new_y = (position.y + amount).clamp(-max_y, max_y)
  
//   Point.new(
//       position.x,
//       new_y,
//       position.z,
//   )
// end

// def add_to_z_level(amount, position)
//   new_z = (position.z + amount).clamp(0, max_z)
//   zooming_out = zooming_out?(amount)
  
//   Point.new(
//       zooming_out ? 0 : position.x,
//       zooming_out ? 0 : position.y,
//       new_z,
//   )
// end

// def zooming_out?(amount)
//   return true if amount < 0

//   false
// end

// def max_x
//   scrollable? ? max_xy_scroll : 0
// end

// def max_y
//   scrollable? ? max_xy_scroll : 0
// end

// def scrollable?
//   @current_position.z >= max_z
// end

// def max_xy_scroll
//   64
// end

// def max_z 
//   4
// end

// def generate_new_zoomed_in_map(position)
//   zoom_length = next_matrix_width
//   unfilled_new_matrix = []
//   matrix.each_with_index{ |row, i|
//       unfilled_new_matrix << expanded_row(zoom_length, matrix[i])
//       if unfilled_new_matrix.length < zoom_length
//           unfilled_new_matrix << new_row(zoom_length)
//       end
//     }
  
//   filled_new_matrix = fill_none_tiles(unfilled_new_matrix)

//   @matrix_map[position.to_s] = filled_new_matrix
// end

// def generate_new_zoomed_out_map(position)
//   new_matrix = []
//   matrix.each_with_index{ |row, i|
//       if i.even?
//           new_row = []
//           matrix[i].each_with_index{ |tile, j|
//               new_row << tile if j.even?
//           }
//           new_matrix << new_row
//       end
//     }
  
//   @matrix_map[position.to_s] = new_matrix
// end

// def generate_new_perlin_matrix_with_offset(position)
//   new_matrix = GenerateMatrix.new.perlin_matrix(
//       current_matrix_width,
//       offset: {x: position.x, y: position.y}
//   )

//   @matrix_map[position.to_s] = new_matrix
// end

// def get_matrix_scrolled_right(matrix_to_scroll)
//   unfilled_new_matrix = expand_matrix_right(matrix_to_scroll)
//   fill_none_tiles(unfilled_new_matrix)
// end

// def get_matrix_scrolled_left(matrix_to_scroll)
//   unfilled_new_matrix = expand_matrix_left(matrix_to_scroll)
//   fill_none_tiles(unfilled_new_matrix)
// end

// def get_matrix_scrolled_up(matrix_to_scroll)
//   unfilled_new_matrix = expand_matrix_up(matrix_to_scroll)
//   fill_none_tiles(unfilled_new_matrix)
// end

// def get_matrix_scrolled_down(matrix_to_scroll)
//   unfilled_new_matrix = expand_matrix_down(matrix_to_scroll)
//   fill_none_tiles(unfilled_new_matrix)
// end

// def generate_new_scrolled_right_map(position)
//   unfilled_new_matrix = expand_matrix_right(matrix)
//   filled_new_matrix = fill_none_tiles(unfilled_new_matrix)
//   @matrix_map[position.to_s] = filled_new_matrix
// end

// def generate_new_scrolled_left_map(position)
//   unfilled_new_matrix = expand_matrix_left(matrix)
//   filled_new_matrix = fill_none_tiles(unfilled_new_matrix)
//   @matrix_map[position.to_s] = filled_new_matrix
// end

// def generate_new_scrolled_up_map(position)
//   unfilled_new_matrix = expand_matrix_up(matrix)
//   filled_new_matrix = fill_none_tiles(unfilled_new_matrix)
//   @matrix_map[position.to_s] = filled_new_matrix
// end

// def generate_new_scrolled_down_map(position)
//   unfilled_new_matrix = expand_matrix_down(matrix)
//   filled_new_matrix = fill_none_tiles(unfilled_new_matrix)
//   @matrix_map[position.to_s] = filled_new_matrix
// end

// def expand_matrix_right(matrix_to_expand)
//   matrix_to_expand.dup.map.with_index{ |row, y|
//       new_row = row.dup
//       new_row.shift
//       new_row << Constants::TILE_TYPES[:NONE]
      
//       new_row
//   }
// end

// def expand_matrix_left(matrix_to_expand)
//   matrix_to_expand.dup.map.with_index{ |row, y|
//       new_row = row.dup
//       new_row.pop
//       new_row.unshift(Constants::TILE_TYPES[:NONE])
      
//       new_row
//   }
// end

// def expand_matrix_up(matrix_to_expand)
//   unfilled_new_matrix = []
//   matrix_to_expand.dup.map.with_index{ |row, i|
//       unfilled_new_matrix << row.dup if i < (current_matrix_width() - 1)
//   }

//   unfilled_new_matrix.unshift(new_row(current_matrix_width()))
//   unfilled_new_matrix
// end

// def expand_matrix_down(matrix_to_expand)
//   unfilled_new_matrix = []
//   matrix_to_expand.dup.map.with_index{ |row, i|
//       unfilled_new_matrix << row.dup if i > 0
//   }

//   unfilled_new_matrix << new_row(current_matrix_width)
//   unfilled_new_matrix
// end

// def expanded_row(zoom_length, current_row)
//   new_row = []
//   current_row.each_with_index{ |row, i|
//     new_row << current_row[i]
//     if new_row.length < zoom_length
//       new_row << Constants::TILE_TYPES[:NONE]
//     end
//   }
  
//   new_row
// end

// def new_row(zoom_length)
//   return Array.new(zoom_length, Constants::TILE_TYPES[:NONE])
// end

// def fill_none_tiles(unfilled_matrix)
//   new_matrix = []
//   unfilled_matrix.each_with_index { |row, y|
//       new_row = []
//       row.each_with_index { |tile, x|
//           new_tile = tile
//           if tile == Constants::TILE_TYPES[:NONE]
//               neighboring_tiles = get_tiles_in_neighboring_positions(x, y, unfilled_matrix);
//               random_neighbor_tile = neighboring_tiles.select{|tile| ![Constants::TILE_TYPES[:NONE]].include?(tile) }.sample
//               new_tile = random_neighbor_tile != Constants::TILE_TYPES[:NONE] ? random_neighbor_tile : Constants::TILE_TYPES.sample
//           end

//           new_row << new_tile
//       }
      
//       new_matrix << new_row
//   }

//   new_matrix
// end

// def get_tiles_in_neighboring_positions(x, y, current_matrix)
//   relative_neighboring_positions = [
//       {x: -1, y: 0},
//       {x: 1, y: 0},
//       {x: 0, y: -1},
//       {x: 0, y: 1},
//       {x: -1, y: -1},
//       {x: 1, y: 1},
//       {x: 1, y: -1},
//       {x: -1, y: 1},
//   ]

//   neighboring_tiles = []
//   relative_neighboring_positions.map { |pos|
//       tile = get_tile_at_position(x + pos[:x], y + pos[:y], current_matrix)
//       neighboring_tiles << tile if tile
//   }

//   neighboring_tiles
// end

// def get_tile_at_position(x, y, current_matrix)
//   begin
//       return current_matrix[y][x]
//   rescue => exception
//       return false
//   end
// end