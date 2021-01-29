let baseFrequency = 1;
const phi = 0.618033988749887;
const harmonics = 8;


const frequencies = [baseFrequency];

for (let i = 0; i < harmonics; i++) {
    baseFrequency *= phi;
    frequencies.push(baseFrequency);
}

console.log(frequencies);