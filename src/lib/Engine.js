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
      this.showKeyPrompts(),
      this.display.draw(),
      "",
      "-----------------------",
      "",
      "",
    ].join("\r\n")
  }

  onKeypress(event) {
    return this.handleDefaultKeypress(event)
  }

  handleDefaultKeypress(event) {
    const eventKey = event.key;
    const eventName = event.code;
    if (this.getKeyMap()[eventKey]) {
      this.getKeyMap()[eventKey]();
      return true
    }
    if (this.getKeyMap()[eventName]) {
      this.getKeyMap()[eventName]();
      return true
    }

    return false
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
      'c': world.cycleTheme.bind(world),
      'e': () => this.exportToTxt(this.world, this.display),
      'p': () => this.exportToPNG(this.world, this.display),
      'ArrowUp': world.scrollUp.bind(world),
      'ArrowDown': world.scrollDown.bind(world),
      'ArrowRight': world.scrollRight.bind(world),
      'ArrowLeft': world.scrollLeft.bind(world),
    };
  }

  getKeymapLabel(key) {
    return {
      r: "to generate new world",
      z: "to zoom in",
      x: "to zoom out",
      n: "to rename this world",
      c: "to switch theme",
      e: "to save this world in text",
      p: "to save this world as image",
    }[key]
  }

  showKeyPrompts() {
    return [
      '',
      "r to generate new world",
      this.world.scrollable() ? "arrow keys to explore" : "",
      "z to zoom in",
      "x to zoom out",
      "n to rename this world",
      "c to switch theme",
      "e to save this world in text",
      "p to save this world as image",
      "-----------------------",
      "",
    ].join("\r\n");
  }

  nameWorld() {
    const newName = this.prompt('what do people call this world?');
    this.world.setName(newName);
  }

  defaultAction() {
    return true;
  }

  createFileName(world, extension = 'txt') {
    const currentTime = new Date();
    const fileName = `${currentTime.getFullYear()}_${(currentTime.getMonth() + 1).toString().padStart(2, '0')}_${currentTime.getDate().toString().padStart(2, '0')}__${currentTime.getHours().toString().padStart(2, '0')}${currentTime.getMinutes().toString().padStart(2, '0')}${currentTime.getSeconds().toString().padStart(2, '0')}_${world.name.replace(/\s+/g, '_')}.${extension}`;

    return fileName;
  }

  exportToTxt(world, display) {
    const content = world.draw(display.tileSize);

    const fileName = this.createFileName(world);

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.textContent = 'Download File';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    // Show success message to the user
    window.alert(`Successfully saved to ${fileName}`);
  }

  exportToPNG(world, display) {
    const content = world.draw(display.tileSize)
    const lines = content.split(/\r?\n/);
    const canvas = document.createElement('canvas');
    // const width = window.screen.width;
    // const height = window.screen.height;
    const fontSize = 11;
    const lineHeight = fontSize;
    const padding = 20;
    const worldNameDisplayLength = world.worldNameDisplay().length * fontSize;
    const width = Math.max(
      worldNameDisplayLength,
      lines.at(-1).length * fontSize * 0.6
    ) + (padding * 2);
    const height = (lines.length * lineHeight) + (padding * 2);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // For example, if you have a renderMap method in your Display class
    this.renderToCanvas(ctx, lines, canvas.width, canvas.height, fontSize, lineHeight, padding);

    // Convert canvas content to a data URL
    const dataURL = canvas.toDataURL('image/png');
    const fileName = this.createFileName(world, 'png');

    // Create a link element for downloading
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = fileName;
    link.textContent = 'Download Image';

    // Append the link to the document and simulate click
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link
    document.body.removeChild(link);

    window.alert(`Successfully saved to ${fileName}`);
  }


  renderToCanvas(ctx,
    lines,
    width,
    height,
    fontSize = 11,
    lineHeight = 20,
    padding = 0
  ) {
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    const root = document.documentElement;
    const bgColor = getComputedStyle(root).getPropertyValue('--color-bg');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    const textColor = getComputedStyle(root).getPropertyValue('--color-output');
    ctx.fillStyle = textColor;
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * lineHeight);
    });
}

}

export default Engine;