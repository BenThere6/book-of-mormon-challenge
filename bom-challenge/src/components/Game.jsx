import React, { useState } from 'react';
import verses from '../verses'; // Import your verse texts
import verseCounts from '../verseCounts'; // Import your verse counts database

function Game({ difficulty, endGame }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentVerse, setCurrentVerse] = useState(getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');

  function getRandomVerse() {
    const keys = Object.keys(verses);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey;
  }

  function handleBookSelection(book) {
    setSelectedBook(book);
    setSelectedChapter('');
    setSelectedVerse('');
  }

  function handleChapterSelection(chapter) {
    setSelectedChapter(chapter);
    setSelectedVerse('');
  }

  function handleVerseSelection(verse) {
    setSelectedVerse(verse);
  }

  const handleSubmit = () => {
    console.log('Submitting guess with:', selectedBook, selectedChapter, selectedVerse);

    const guessAccuracy = calculateAccuracy(
      { book: selectedBook, chapter: selectedChapter, verse: selectedVerse },
      currentVerse
    );

    console.log('Guess accuracy:', guessAccuracy);

    if (guessAccuracy > 0) {
      setScore(score + guessAccuracy);
      setCurrentVerse(getRandomVerse());
      setSelectedBook('');
      setSelectedChapter('');
      setSelectedVerse('');
    } else {
      setCurrentVerse(getRandomVerse());
      setSelectedBook('');
      setSelectedChapter('');
      setSelectedVerse('');
    }
    if (guessAccuracy < 36) {
      setLives(lives - 1);
    }

    if (lives === 1) {
      endGame(score);
    }
  };

  const calculateAccuracy = (guess, verseToCheck) => {
    // Find the index of the last space to correctly split book and chapter:verse
    const lastSpaceIndex = verseToCheck.lastIndexOf(' ');
    const correctBook = verseToCheck.substring(0, lastSpaceIndex);
    const correctChapterVerse = verseToCheck.substring(lastSpaceIndex + 1);

    const [correctChapterStr, correctVerseNumStr] = correctChapterVerse.split(':');
    const correctChapter = parseInt(correctChapterStr, 10);
    const correctVerseNum = parseInt(correctVerseNumStr, 10);

    console.log('Correct Book:', correctBook);
    console.log('Correct Chapter:', correctChapter);
    console.log('Correct Verse:', correctVerseNum);

    const chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);
    const verseDifference = Math.abs(parseInt(guess.verse, 10) - correctVerseNum);

    console.log("chapterDiff = ", chapterDifference);
    console.log("verseDiff = ", verseDifference);

    if (guess.book === correctBook) {
      let multiplier = 1;
      let chapterRange = 5;
      let verseRange = 10;

      switch (difficulty) {
        case 'easy':
          multiplier = 1;
          chapterRange = 5;
          verseRange = 10;
          break;
        case 'medium':
          multiplier = 2;
          chapterRange = 3;
          verseRange = 6;
          break;
        case 'hard':
          multiplier = 3;
          chapterRange = 1;
          verseRange = 2;
          break;
        default:
          console.log("Invalid difficulty level");
          return 0;
      }

      let accuracy = 5 * multiplier;
      console.log("Correct book", 5 * multiplier);
      if (chapterDifference === 0) {
        accuracy += 50 * multiplier;
        console.log("Correct chapter", 50 * multiplier);
      } else if (chapterDifference <= chapterRange) {
        accuracy += 30 * multiplier;
        console.log("Chapter within range", 30 * multiplier);
      }
      if (verseDifference === 0) {
        accuracy += 100 * multiplier;
        console.log("Correct verse", 100 * multiplier);
      } else if (verseDifference <= verseRange) {
        accuracy += 50 * multiplier;
        console.log("Verse within range", 50 * multiplier);
      }

      return accuracy;
    } else {
      console.log("Unfortunately.... you got no points...");
      return 0;
    }
  };

  const renderBooks = () => (
    <div>
      <h3>Select Book:</h3>
      {Object.keys(verseCounts).map((book) => (
        <button key={book} onClick={() => handleBookSelection(book)} disabled={selectedBook === book}>
          {book}
        </button>
      ))}
    </div>
  );

  const renderChapters = () => {
    if (!selectedBook) return null;

    const chapterCount = verseCounts[selectedBook].length;
    const chapters = Array.from({ length: chapterCount }, (_, index) => index + 1);

    return (
      <div>
        <h3>Select Chapter:</h3>
        {chapters.map((chapter) => (
          <button key={chapter} onClick={() => handleChapterSelection(chapter)} disabled={selectedChapter === chapter}>
            {chapter}
          </button>
        ))}
      </div>
    );
  };

  const renderVerses = () => {
    if (!selectedBook || !selectedChapter) return null;

    const verseCount = verseCounts[selectedBook][selectedChapter - 1];
    const verses = Array.from({ length: verseCount }, (_, index) => index + 1);

    return (
      <div>
        <h3>Select Verse:</h3>
        {verses.map((verse) => (
          <button
            key={verse}
            onClick={() => handleVerseSelection(verse)}
            disabled={selectedVerse === verse}
          >
            {verse}
          </button>
        ))}
      </div>
    );
  };

  const getCurrentVerseText = () => {
    const verseText = verses[currentVerse];
    return verseText || 'Verse Not Found';
  };

  return (
    <div>
      <h2>Score: {score}</h2>
      <h2>Lives: {lives}</h2>
      <p>{getCurrentVerseText()}</p>
      {renderBooks()}
      {renderChapters()}
      {renderVerses()}
      {selectedVerse !== '' && (
        <button onClick={handleSubmit}>
          Submit Guess
        </button>
      )}
    </div>
  );
}

export default Game;