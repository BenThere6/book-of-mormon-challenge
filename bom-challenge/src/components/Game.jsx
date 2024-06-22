import React, { useState } from 'react';
import verseCount from '../verseCounts'; // Import your verse counts database

function Game({ difficulty, endGame }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentVerse, setCurrentVerse] = useState(getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');

  function getRandomVerse() {
    const books = Object.keys(verseCount);
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const chapters = verseCount[randomBook];
    const randomChapterIndex = Math.floor(Math.random() * chapters.length);
    const randomChapter = randomChapterIndex + 1;
    const verses = chapters[randomChapterIndex];
    const randomVerse = Math.floor(Math.random() * verses.length);

    return `${randomBook} ${randomChapter}:${randomVerse + 1}`;
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
    const correctReference = currentVerse.split(' ');
    const [correctBook, correctChapterVerse] = [correctReference[0], correctReference[1]];
    const [correctChapter, correctVerse] = correctChapterVerse.split(':');

    const guessAccuracy = calculateAccuracy(
      { book: selectedBook, chapter: selectedChapter, verse: selectedVerse },
      { book: correctBook, chapter: correctChapter, verse: correctVerse }
    );

    if (guessAccuracy > 0) {
      setScore(score + guessAccuracy);
      setCurrentVerse(getRandomVerse());
      setSelectedBook('');
      setSelectedChapter('');
      setSelectedVerse('');
    } else {
      setLives(lives - 1);
      setSelectedVerse('');
    }

    if (lives === 1) { // Check lives before decrementing
      endGame(score);
    }
  };

  const calculateAccuracy = (guess, correct) => {
    const chapterDifference = Math.abs(guess.chapter - correct.chapter);
    const verseDifference = Math.abs(guess.verse - correct.verse);

    if (guess.book === correct.book) {
      switch (difficulty) {
        case 'easy':
          if (chapterDifference <= 5 && verseDifference <= 10) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 100;
            } else if (chapterDifference === 0 && verseDifference <= 10) {
              return 50;
            } else if (chapterDifference <= 5 && verseDifference <= 10) {
              return 25;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        case 'medium':
          if (chapterDifference <= 3 && verseDifference <= 6) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 200;
            } else if (chapterDifference === 0 && verseDifference <= 6) {
              return 100;
            } else if (chapterDifference <= 3 && verseDifference <= 6) {
              return 50;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        case 'hard':
          if (chapterDifference <= 1 && verseDifference <= 2) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 300;
            } else if (chapterDifference === 0 && verseDifference <= 2) {
              return 150;
            } else if (chapterDifference <= 1 && verseDifference <= 2) {
              return 75;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        default:
          return 0;
      }
    } else {
      return 0;
    }
  };

  const renderBooks = () => (
    <div>
      <h3>Select Book:</h3>
      {Object.keys(verseCount).map((book) => (
        <button key={book} onClick={() => handleBookSelection(book)} disabled={selectedBook === book}>
          {book}
        </button>
      ))}
    </div>
  );

  const renderChapters = () => {
    if (!selectedBook) return null;

    const chapters = verseCount[selectedBook];

    return (
      <div>
        <h3>Select Chapter:</h3>
        {chapters.map((_, index) => (
          <button key={index + 1} onClick={() => handleChapterSelection(index + 1)} disabled={selectedChapter === (index + 1).toString()}>
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  const renderVerses = () => {
    if (!selectedBook || !selectedChapter) return null;
  
    const verses = verseCount[selectedBook][selectedChapter - 1];
  
    return (
      <div>
        <h3>Select Verse:</h3>
        {verses.map((_, index) => (
          <button key={index + 1} onClick={() => handleVerseSelection(index + 1)} disabled={selectedVerse === (index + 1).toString()}>
            {index + 1}
          </button>
        ))}
      </div>
    );
  };
  
  // Retrieve current verse text based on currentVerse state
  const getCurrentVerseText = () => {
    const [book, chapterVerse] = currentVerse.split(' ');
    const [chapter, verse] = chapterVerse.split(':');
    const verseIndex = parseInt(verse, 10) - 1; // Convert to zero-based index

    return verseCount[book][parseInt(chapter, 10) - 1][verseIndex];
  };

  return (
    <div>
      <h2>Score: {score}</h2>
      <h2>Lives: {lives}</h2>
      <p>{getCurrentVerseText()}</p> {/* Display current verse text */}
      {renderBooks()}
      {renderChapters()}
      {renderVerses()}
      <button onClick={handleSubmit} disabled={!selectedBook || !selectedChapter || !selectedVerse}>
        Submit Guess
      </button>
    </div>
  );
}

export default Game;