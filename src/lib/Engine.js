class Engine {
  constructor(prompt, display) {
    this.running = false;
    this.prompt = prompt;
    this.display = display;
    this.world = this.display.world
    // this.alerts = new AlertSystem();
  }

  run() {
    this.display.draw();
    // this.showKeyPrompts();

    // this.initializeKeyPrompt();
    // while (this.isRunning()) {
    //   this.display.draw();
    //   // this.alerts.draw();
    //   this.showKeyPrompts();
    // }
  }

  get keyMap() {
    return {
      'q': this.stop,
      'r': this.world.regenerate,
      'z': this.world.zoom_in,
      'x': this.world.zoom_out,
      'n': this.nameWorld,
      'c': this.world.cycle_theme,
      // 'e': this.exportToTxt,
      // 'up': this.world.scroll_up,
      // 'down': this.world.scroll_down,
      // 'right': this.world.scroll_right,
      // 'left': this.world.scroll_left,
    };
  }

  initializeKeyPrompt() {
    this.prompt.on('keypress', event => {
      const eventKey = event.value;
      const eventName = event.key.name;
      if (this.keyMap[eventKey]) this.keyMap[eventKey]();
      if (this.keyMap[eventName]) this.keyMap[eventName]();
    });
  }

  showKeyPrompts() {
    this.prompt.keypress([
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
    ].join("\n"));
  }

  nameWorld() {
    const new_name = this.prompt.ask('what do people call this world?');
    this.world.setName(new_name);
  }

  defaultAction() {
    return true;
  }

  start() {
    if (this.isRunning()) {
      throw new Error('Engine already running');
    }

    this.running = true;
    this.run();
  }

  stop() {
    this.running = false;
  }

  isRunning() {
    return this.running;
  }

  isStopped() {
    return !this.isRunning();
  }
}

export default Engine;