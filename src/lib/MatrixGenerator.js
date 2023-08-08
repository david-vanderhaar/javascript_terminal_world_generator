import { Noise } from 'noisejs';
import { TILE_TYPES } from '$lib/constants';

export default class MatrixGenerator {
    twoLandsMatrix() {
        return [
            [TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.PLAIN, TILE_TYPES.FOREST],
            [TILE_TYPES.PLAIN, TILE_TYPES.PLAIN, TILE_TYPES.WATER, TILE_TYPES.PLAIN],
            [TILE_TYPES.FOREST, TILE_TYPES.PLAIN, TILE_TYPES.WATER, TILE_TYPES.WATER],
            [TILE_TYPES.MOUNTAIN, TILE_TYPES.FOREST, TILE_TYPES.PLAIN, TILE_TYPES.WATER],
        ];
    }

    waterWorldMatrix() {
        return [
            [TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER],
            [TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER],
            [TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER],
            [TILE_TYPES.MOUNTAIN, TILE_TYPES.WATER, TILE_TYPES.WATER, TILE_TYPES.WATER],
        ];
    }

    noiseMatrix(seed, size, offset = { x: 0, y: 0 }) {
        const noise = new Noise(seed);
        const noiseMatrix = [];
        const offset_x = offset.x;
        const offset_y = offset.y;

        for (let x = 0; x < size; x++) {
            const row = [];
            for (let y = 0; y < size; y++) {
                const n = noise.simplex2((offset_x + x) * this.step(), (offset_y + y) * this.step());
                const contrasted = this.contrast(n);
                row.push(this.bar(contrasted));
            }
            noiseMatrix.push(row);
        }

        return noiseMatrix;
    }

    step() {
        return 0.2;
    }

    contrast(value) {
        return (value + 1) / 2;
    }

    bars() {
        return [
            TILE_TYPES.WATER,
            TILE_TYPES.WATER,
            TILE_TYPES.PLAIN,
            TILE_TYPES.FOREST,
            TILE_TYPES.MOUNTAIN,
        ];
    }

    bar(chance) {
        const bars = this.bars();
        return bars[Math.floor(bars.length * chance)];
    }
}
