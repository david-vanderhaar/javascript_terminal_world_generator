<script>
  import { onMount } from "svelte";
import WorldInYourTerminal from "../lib/WorldInYourTerminal.js";
    import Engine from "$lib/Engine.js";

  let user = 'world'
  let machine = 'terminal'

  let root;
  function setVariables(variables) {
    Object.entries(variables).forEach(v => root.style.setProperty(v[0], v[1]));
  }

  function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; ++i) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function changeTheme() {
    const obj = {
      '--color-bg': randomColor(),
    }
    setVariables(obj);
  }

  let output = '';
  let prompter;
  let engineReference;

  onMount(() => {
    root = document.documentElement;
    const {engine} = new WorldInYourTerminal().explore({tileSize: 1, maxZoom: 10})
    engineReference = engine;
    prompter = engine.keyPrompter.bind(engine);
    output = engine.run()
  });

    
  function handleKeypress(event) {
    // changeTheme();
    prompter(event);
    output = engineReference.run()
  }


</script>

<svelte:head>
	<title>World in Your Terminal</title>
</svelte:head>

<div class="terminal">
	<div class="output" style="margin-bottom: 1rem;">This is a javascript port of my earlier Ruby World Generator, which was packaged as a ruby gem. This implementation is a web app for the browser, and uses the same world generation algorithms as the original.</div>
  <div class="output">{output}</div>
	<p class="prompt">
    {user}@{machine}:
    <span class="terminal-cursor">◐</span>
  </p>
</div>
<svelte:window on:keydown={handleKeypress} />

<style>
  .terminal-cursor {
    animation: blink 1s infinite;
  }

  .output {
    white-space: pre-wrap;
  } 

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
