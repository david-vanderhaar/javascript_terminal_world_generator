import Prompter from './Prompter';
import Display from './Display';
import Engine from './Engine';

class WorldInYourTerminal {
    explore(prompt) {
        console.log(prompt);
        const display = new Display(40);
        // const prompt = new Prompter();
        const engine = new Engine(prompt, display);
        return {engine, display};
    }
}

export default WorldInYourTerminal;