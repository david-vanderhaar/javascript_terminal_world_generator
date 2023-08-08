import Display from './Display';
import Engine from './Engine';

class WorldInYourTerminal {
    explore({tileSize = 1, theme = 'DEFAULT', maxZoom = 10, maxScroll = 64}) {
        const display = new Display({tileSize, theme, maxZoom, maxScroll});
        const engine = new Engine(display);
        return {engine, display};
    }
}

export default WorldInYourTerminal;