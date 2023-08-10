<script>
  import Device from 'svelte-device-info'
  import { onMount } from "svelte";
  import WorldInYourTerminal from "$lib/WorldInYourTerminal.js";

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
  let engineReference;
  let mobileKeypressOptions = {}
  let isMobileDevice;
  let overlay = true;
  let terminal;

  onMount(() => {
    root = document.documentElement;
    const {engine} = new WorldInYourTerminal().explore({tileSize: 1, maxZoom: 8})
    engineReference = engine;
    output = engine.run()
    mobileKeypressOptions = createMobileKeypressOptions(engineReference.getKeyMap());
    isMobileDevice = Device.isMobile
    terminal = document.querySelector('.terminal');
  });

  function createMobileKeypressOptions(keymap) {
    const options = {}
    Object.entries(keymap).forEach(([key]) => {
      const label = engineReference.getKeymapLabel(key);
      if (label) {
        options[key] = {
          label,
          handle: () => handleKeypress({key}),
        }
      }
    })
    return options;
  }

  function handleKeypress(event) {
    engineReference.onKeypress(event);
    output = engineReference.run()
  }

  function chopFirstNLines(str, n) {
    return str.split('\n').slice(n).join('\n');
  }

  function handleFocus() {
    if (overlay) overlay = false;

    // animate the terminal
    terminal.classList.add('crt-flicker');
    setTimeout(() => {
      terminal.classList.remove('crt-flicker');
    }, 300);
  }

  $: finalOutput = chopFirstNLines(output, isMobileDevice ? 8 : 1);
</script>

<svelte:head>
	<title>World in Your Terminal</title>
</svelte:head>

<div class="terminal">
  {#if isMobileDevice}
  <div class="output output-mobile">
    {#each Object.entries(mobileKeypressOptions) as [key, value]}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <button on:click={value.handle} class="">{key}: {value.label}</button>
    {/each}
  </div>
  {/if}
  <div class="output map">{finalOutput}</div>
	<!-- <p class="prompt">
    {user}@{machine}:
    <span class="terminal-cursor">◐</span>
  </p> -->
  <div class="output" style="margin-bottom: 1rem;">This is a javascript port of my earlier Ruby World Generator, which was packaged as a ruby gem. This implementation is a web app for the browser, and uses the same world generation algorithms as the original.</div>
</div>
{#if overlay && !isMobileDevice}
  <div class="full-screen-overlay">
    <button class="start-button crt-flicker">
      click to initialize
    </button>
  </div>
{/if}
<svelte:window on:keydown={handleKeypress} on:click={handleFocus} />

<style>
  .start-button {
    border: none;
    background: none;
    font-size: 2rem;
    font-family: monospace;
    color: var(--color-output);
    background: var(--color-bg);
    /* background: #00FF9C; */
    opacity: 0.7;
    cursor: pointer;
    padding: 1rem;
    min-height: 100px;
  }
  .full-screen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    /* background: var(--color-bg); */
    background: transparent;
    color: var(--color-output);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-family: monospace;
    z-index: 100;
  }

  .output-mobile {
    cursor: pointer;
    /* text-decoration: dashed underline; */
  }

  .output-mobile > * {
    border: none;
    background: none;
    display: block;
    margin: 0 0 8px 0;
    padding: 0 0 4px 0;
    border-bottom: 1px dashed var(--color-prompt);
    /* padding: 4px; */
    /* border-left: 1px dashed var(--color-prompt); */
    /* border-right: 1px dashed var(--color-prompt); */
    /* font-size: 1.5rem; */
    font-family: monospace;
    color: var(--color-output);
    cursor: pointer;
    /* text-decoration: dashed underline; */
  }
  .terminal-cursor {
    animation: blink 1s infinite reverse;
  }

  .map {
    white-space: pre;
  }

  .crt-flicker { 
    text-shadow: 0.06rem 0 0.06rem #ea36af, -0.125rem 0 0.06rem #75fa69;
    animation-duration: 0.01s;
    animation-name: textflicker;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  .blinking {
    animation: blinker 2s infinite;
  }

  @keyframes textflicker {
    from {
      text-shadow: 1px 0 0 #ea36af, -2px 0 0 #75fa69;
    }
    to {
      text-shadow: 2px 0.5px 2px #ea36af, -1px -0.5px 2px #75fa69;
    }
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

  @keyframes blinker {
    0% {
      opacity: 0.2;
    }
    19% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    21% {
      opacity: 1;
    }
    22% {
      opacity: 0.2;
    }
    23% {
      opacity: 0.2;
    }
    36% {
      opacity: 0.2;
    }
    40% {
      opacity: 1;
    }
    41% {
      opacity: 0;
    }
    42% {
      opacity: 1;
    }
    43% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
</style>
