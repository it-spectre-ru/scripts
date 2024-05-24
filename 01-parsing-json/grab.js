import fs from 'fs';

const rawData = fs.readFileSync('./data.json', 'utf8');
const data = JSON.parse(rawData);

let combinedText = '';

for (const subtitle of data.subtitles) {
  combinedText += subtitle.text + '\n';
}

fs.writeFileSync('combined_text.txt', combinedText);