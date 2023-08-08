class Engine {
  constructor(display) {
    this.running = false;
    this.display = display;
    // this.world = this.display.world;
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

    
    // while (this.isRunning()) {
    //   this.display.draw();
    //   // this.alerts.draw();
    //   this.showKeyPrompts();
    // }
  }

  getKeyMap() {
    return {
      'r': this.world.regenerate.bind(this.world),
      'z': this.world.zoomIn.bind(this.world),
      'x': this.world.zoomOut.bind(this.world),
      // 'n': this.nameWorld,
      'c': this.world.cycleTheme.bind(this.world),
      // 'e': this.exportToTxt,
      // 'up': this.world.scroll_up,
      // 'down': this.world.scroll_down,
      // 'right': this.world.scroll_right,
      // 'left': this.world.scroll_left,
    };
  }

  keyPrompter(event) {
    const eventKey = event.key;
    const eventName = event.code;
    if (this.getKeyMap()[eventKey]) this.getKeyMap()[eventKey]();
    if (this.getKeyMap()[eventName]) this.getKeyMap()[eventName]();
  }

  showKeyPrompts() {
    return [
      '',
      "-----------------------",
      "r to generate new world",
      this.world.scrollable ? "arrow keys to explore" : "",
      "z to zoom in",
      "x to zoom out",
      // "n to rename this world",
      // "c to switch theme",
      // "e to save this world in text",
      // "q to quit",
      "",
    ].join("\n");
  }

  // nameWorld() {
  //   const new_name = this.prompt.ask('what do people call this world?');
  //   this.world.setName(new_name);
  // }

  defaultAction() {
    return true;
  }
}

export default Engine;