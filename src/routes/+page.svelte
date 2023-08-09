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

  onMount(() => {
    root = document.documentElement;
    const {engine} = new WorldInYourTerminal().explore({tileSize: 1, maxZoom: 2})
    engineReference = engine;
    output = engine.run()
    mobileKeypressOptions = createMobileKeypressOptions(engineReference.getKeyMap());
    isMobileDevice = Device.isMobile
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

  function chopLastNLines(str, n) {
    return str.split('\n').slice(0, -n).join('\n');
  }

  $: finalOutput = chopLastNLines(output, isMobileDevice ? 8 : 1);
</script>

<svelte:head>
	<title>World in Your Terminal</title>
</svelte:head>

<div class="terminal">
	<div class="output" style="margin-bottom: 1rem;">This is a javascript port of my earlier Ruby World Generator, which was packaged as a ruby gem. This implementation is a web app for the browser, and uses the same world generation algorithms as the original.</div>
  <div class="output map">{finalOutput}</div>
	<!-- <p class="prompt">
    {user}@{machine}:
    <span class="terminal-cursor">◐</span>
  </p> -->
  {#if isMobileDevice}
  <p class="output output-mobile">
    {#each Object.entries(mobileKeypressOptions) as [key, value]}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={value.handle} class="">{key}: {value.label}</div>
    {/each}
  </p>
  {/if}
</div>
<svelte:window on:keydown={handleKeypress} />

<style>
  .output-mobile {
    cursor: pointer;
    text-decoration: dashed underline;
  }
  .terminal-cursor {
    animation: blink 1s infinite;
  }

  .map {
    white-space: pre;
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
