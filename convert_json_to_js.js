const fs = require('fs');

const convertJsonToJs = () => {
  const verses = JSON.parse(fs.readFileSync('verses.json', 'utf8'));
  const content = `const verses = ${JSON.stringify(verses, null, 2)};\n\nexport default verses;\n`;
  fs.writeFileSync('verses.js', content);
  console.log('Conversion complete. Verses saved to verses.js.');
};

convertJsonToJs();