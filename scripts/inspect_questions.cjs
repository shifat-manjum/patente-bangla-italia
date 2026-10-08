const fs = require('fs');

const rqContent = fs.readFileSync('./src/data/roundQuestions.ts', 'utf8');
const itMatches = [];
const regex = /"questionIt":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(rqContent)) !== null) {
  itMatches.push(m[1]);
}
console.log('Total questionIt in roundQuestions.ts:', itMatches.length);
const uniqueIt = Array.from(new Set(itMatches));
console.log('Unique questionIt in roundQuestions.ts:', uniqueIt.length);

const transContent = fs.readFileSync('./src/data/patenteTranslationsBn.ts', 'utf8');
const transMatches = [];
const transRegex = /"([^"]+)":\s*"([^"]+)"/g;
let tm;
while ((tm = transRegex.exec(transContent)) !== null) {
  transMatches.push({ it: tm[1], bn: tm[2] });
}
console.log('Total entries in patenteTranslationsBn.ts:', transMatches.length);
