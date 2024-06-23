// Import your original verses object
import verses from './verses';

// Define the scripture mastery references
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

// Function to extract scripture mastery verses from the verses object
const extractScriptureMasteryVerses = () => {
  const scriptureMasteryVerses = {};

  // Loop through each scripture mastery reference
  scriptureMasteryReferences.forEach(reference => {
    const versesToAdd = [];

    // Loop through each verse in the verses object
    Object.entries(verses).forEach(([verseRef, verseText]) => {
      if (isVerseInReference(verseRef, reference)) {
        versesToAdd.push(verseText);
      }
    });

    // Add combined verses to the scriptureMasteryVerses object
    scriptureMasteryVerses[reference] = versesToAdd.join(' ');
  });

  return scriptureMasteryVerses;
};

// Helper function to check if a verse reference belongs to a scripture mastery reference
const isVerseInReference = (verseRef, reference) => {
  // Split the reference into book, chapter, and verse parts
  const [bookRef, chapterRef, verseRefRange] = reference.split(' ');
  const [startVerseRef, endVerseRef] = verseRefRange.split('–');

  // Split the verse reference into book, chapter, and verse parts
  const [book, chapter, verse] = verseRef.split(' ');

  // Check if the verse is within the range specified by the scripture mastery reference
  if (book === bookRef && chapter === chapterRef) {
    // If the reference is a single verse
    if (startVerseRef === verseRef) {
      return true;
    }

    // If the reference is a range of verses
    if (startVerseRef <= verse && verse <= endVerseRef) {
      return true;
    }
  }

  return false;
};

// Export the extracted scripture mastery verses object
const scriptureMastery = extractScriptureMasteryVerses();
export default scriptureMastery;