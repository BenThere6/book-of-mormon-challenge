import fs from 'fs';
import verses from './verses.js';

function generateScriptureMasteryVersesFile() {
  const scriptureMasteryReferences = [
    "1 Nephi 3:7",
    "1 Nephi 19:23",
    "2 Nephi 2:25",
    "2 Nephi 2:27",
    "2 Nephi 9:28–29",
    "2 Nephi 28:7–9",
    "2 Nephi 32:3",
    "2 Nephi 32:8–9",
    "Jacob 2:18–19",
    "Mosiah 2:17",
    "Mosiah 3:19",
    "Mosiah 4:30",
    "Alma 32:21",
    "Alma 34:32–34",
    "Alma 37:6–7",
    "Alma 37:35",
    "Alma 41:10",
    "Helaman 5:12",
    "3 Nephi 11:29",
    "3 Nephi 27:27",
    "Ether 12:6",
    "Ether 12:27",
    "Moroni 7:16–17",
    "Moroni 7:45",
    "Moroni 10:4–5"
  ];

  const scriptureMasteryVerses = {};

  scriptureMasteryReferences.forEach(reference => {
    if (verses[reference]) {
      // If the reference exists in verses, add it to scriptureMasteryVerses
      scriptureMasteryVerses[reference] = verses[reference];
    } else {
      // Handle cases where the reference includes multiple verses
      // Extract the start and end references
      const [startVerseRef, endVerseRef] = reference.split('–');

      // Extract book and chapter
      const startRefParts = startVerseRef.split(' ');
      const book = startRefParts[0];
      const chapter = parseInt(startRefParts[1]);

      const endRefParts = endVerseRef.split(' ');
      const endChapter = parseInt(endRefParts[1]);

      // Loop through verses and add them to scriptureMasteryVerses
      for (let i = chapter; i <= endChapter; i++) {
        const fullReference = `${book} ${i}`;
        if (verses[fullReference]) {
          scriptureMasteryVerses[reference] = scriptureMasteryVerses[reference] || [];
          scriptureMasteryVerses[reference].push(verses[fullReference]);
        }
      }
    }
  });

  // Convert scriptureMasteryVerses object to string format for writing to file
  const script = `const scriptureMasteryVerses = ${JSON.stringify(scriptureMasteryVerses, null, 2)};\n\nmodule.exports = scriptureMasteryVerses;`;

  // Write to scriptureMasteryVerses.js file
  fs.writeFileSync('scriptureMasteryVerses.js', script, 'utf8');

  console.log('Scripture Mastery Verses file generated successfully.');
}

generateScriptureMasteryVersesFile();