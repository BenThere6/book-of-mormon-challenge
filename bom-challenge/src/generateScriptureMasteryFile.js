import fs from 'fs';
import verses from './verses.js'; // Assuming verses.js is in the same directory

function generateScriptureMasteryVersesFile() {
  const scriptureMasteryReferences = [
    "1 Nephi 3:7",
    "1 Nephi 19:23",
    "2 Nephi 2:25",
    "2 Nephi 2:27",
    ["2 Nephi 9:28","2 Nephi 9:29"],
    ["2 Nephi 28:7","2 Nephi 28:8","2 Nephi 28:9"],
    "2 Nephi 32:3",
    ["2 Nephi 32:8","2 Nephi 32:9"],
    ["Jacob 2:18","Jacob 2:19"],
    "Mosiah 2:17",
    "Mosiah 3:19",
    "Mosiah 4:30",
    "Alma 32:21",
    ["Alma 34:32","Alma 34:33","Alma 34:34"],
    ["Alma 37:6","Alma 37:7"],
    "Alma 37:35",
    "Alma 41:10",
    "Helaman 5:12",
    "3 Nephi 11:29",
    "3 Nephi 27:27",
    "Ether 12:6",
    "Ether 12:27",
    ["Moroni 7:16","Moroni 7:17"],
    "Moroni 7:45",
    ["Moroni 10:4","Moroni 10:5"]
  ];

  const scriptureMasteryVerses = {};

  scriptureMasteryReferences.forEach(reference => {
    if (Array.isArray(reference)) {
      // Handle references with multiple verses
      const versesArray = [];
      reference.forEach(verseRef => {
        if (verses[verseRef]) {
          versesArray.push(verses[verseRef]);
        }
      });
      scriptureMasteryVerses[reference.join(', ')] = versesArray.join('\n\n');
    } else {
      // Handle single verse references
      if (verses[reference]) {
        scriptureMasteryVerses[reference] = verses[reference];
      }
    }
  });

  // Convert scriptureMasteryVerses object to string format for writing to file
  const script = `const scriptureMasteryVerses = ${JSON.stringify(scriptureMasteryVerses, null, 2)};\n\nexport default scriptureMasteryVerses;`;

  // Write to scriptureMasteryVerses.js file
  fs.writeFileSync('scriptureMasteryVerses.js', script, 'utf8');

  console.log('Scripture Mastery Verses file generated successfully.');
}

generateScriptureMasteryVersesFile();