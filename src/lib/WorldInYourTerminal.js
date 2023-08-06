import Prompter from './Prompter';
import Display from './Display';
import Engine from './Engine';

class WorldInYourTerminal {
    explore() {
        const display = new Display(40);
        const prompt = new Prompter();

        const engine = new Engine(prompt, display);
        engine.start();

        return engine;
    }
}

export default WorldInYourTerminal;