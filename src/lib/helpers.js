// clamp function
export function clamp(num, min, max) { return Math.min(Math.max(num, min), max); }
export function isEven(num) { return num % 2 === 0;}
export function sample(array) { 
  return array[Math.floor(Math.random() * array.length)]; 
}