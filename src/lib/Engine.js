class Prompter {
  constructor(message) {
    this.message = message;
    this.answer = null;
    this.answerBuffer = null;
  }

  onKeypress(event) {
    // get character from event
    // if character is valid, add to prompt
    // if character is enter, return prompt
    // if character is escape, return null
    if (event.key === 'Enter') {
      return this.answer = this.answerBuffer;
    } else if (event.key === 'Escape') {
      return null;
    } else if (event.key === 'Backspace') {
      this.answerBuffer = this.answerBuffer.slice(0, -1);
    } else {
      this.answerBuffer += event.key;
    }
  }
}

class Engine {
  constructor(display) {
    this.running = false;
    this.display = display;
    this.promptOutput = null;
    // this.alerts = new AlertSystem();
  }

  get world() {
    return this.display.world;
  }

  run() {
    return [
      this.display.draw(),
      this.showKeyPrompts(),
    ].join("\n")
  }

  onKeypress(event) {
    this.handleDefaultKeypress(event)
  }

  handleDefaultKeypress(event) {
    const eventKey = event.key;
    const eventName = event.code;
    if (this.getKeyMap()[eventKey]) this.getKeyMap()[eventKey]();
    if (this.getKeyMap()[eventName]) this.getKeyMap()[eventName]();
  }

  prompt(message) {
    return window.prompt(message);
  }

  getKeyMap() {
    const world = this.world;
    return {
      'r': world.regenerate.bind(world),
      'z': world.zoomIn.bind(world),
      'x': world.zoomOut.bind(world),
      'n': this.nameWorld.bind(this),
      // 'c': world.cycleTheme.bind(world),
      // 'e': this.exportToTxt,
      'ArrowUp': world.scrollUp.bind(world),
      'ArrowDown': world.scrollDown.bind(world),
      'ArrowRight': world.scrollRight.bind(world),
      'ArrowLeft': world.scrollLeft.bind(world),
    };
  }

  showKeyPrompts() {
    return [
      '',
      "-----------------------",
      "r to generate new world",
      this.world.scrollable() ? "arrow keys to explore" : "",
      "z to zoom in",
      "x to zoom out",
      "n to rename this world",
      // "c to switch theme",
      // "e to save this world in text",
      // "q to quit",
      "",
    ].join("\n");
  }

  nameWorld() {
    const newName = this.prompt('what do people call this world?');
    this.world.setName(newName);
  }

  defaultAction() {
    return true;
  }
}

export default Engine;