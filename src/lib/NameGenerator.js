const names = [
  'Earth',
  'Solace',
  'Terra',
  'Nova',
  'Solida',
  'Humus',
  'Viridis',
  'Orb',
  'Solo',
  'Lutum',
  'Vita',
];

const adjectives = [
  '',
  'Red',
  'Green',
  'Blue',
  'Speckled',
  'Spotted',
];

const suffixes = [
  '',
  '',
  '',
  'One',
  'Two',
  'Seven',
];

export default class NameGenerator {
  generate() {
      const name = names[Math.floor(Math.random() * names.length)];
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

      return `${adjective} ${name} ${suffix}`.trim();
  }
}
