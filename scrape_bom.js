const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.churchofjesuschrist.org/study/scriptures/bofm';
const books = [
  "1-ne", "2-ne", "jacob", "enos", "jarom", "omni", "w-of-m", "mosiah", "alma",
  "hel", "3-ne", "4-ne", "morm", "ether", "moro"
];

const verses = {};

async function getVerses(book, chapter) {
  const url = `${BASE_URL}/${book}/${chapter}?lang=eng`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const verseElements = $('p.verse');

    if (verseElements.length === 0) {
      return false; // No verses found, chapter does not exist
    }

    verseElements.each((i, element) => {
      const verseNumber = $(element).find('span.verse-number').text().trim();
      // Combine all text nodes within the 'p.verse' element
      const verseText = $(element).find('p.verse').contents().filter(function() {
        return this.type === 'text';
      }).text().trim();
      const reference = `${book} ${chapter}:${verseNumber}`;
      verses[reference] = verseText;
    });

    return true;
  } catch (error) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return false; // Treat as non-existent chapter in case of error
  }
}

async function scrapeBookOfMormon() {
  for (const book of books) {
    let chapter = 1;
    while (true) {
      console.log(`Scraping ${book} Chapter ${chapter}...`);
      const exists = await getVerses(book, chapter);
      if (!exists) break; // Break the loop if the chapter does not exist
      chapter++;
    }
  }

  fs.writeFileSync('verses.json', JSON.stringify(verses, null, 2));
}

scrapeBookOfMormon().then(() => {
  console.log('Scraping complete. Verses saved to verses.json.');
});
