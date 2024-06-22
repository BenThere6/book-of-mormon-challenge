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
    const guessAccuracy = calculateAccuracy(
      { book: selectedBook, chapter: selectedChapter, verse: selectedVerse },
      currentVerse
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

  const calculateAccuracy = (guess, verseToCheck) => {
    const [correctBook, correctChapterVerse] = verseToCheck.split(' ');
    const [correctChapter, correctVerseNum] = correctChapterVerse.split(':');
  
    const chapterDifference = Math.abs(parseInt(guess.chapter, 10) - parseInt(correctChapter, 10));
    const verseDifference = Math.abs(parseInt(guess.verse, 10) - parseInt(correctVerseNum, 10));
  
    if (guess.book === correctBook) {
      switch (difficulty) {
        case 'easy':
          if (chapterDifference <= 5 && verseDifference <= 10) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 100;
            } else if (chapterDifference === 0 && verseDifference <= 10) {
              return 75;
            } else if (chapterDifference <= 5 && verseDifference <= 10) {
              return 50;
            } else {
              return 25;
            }
          } else {
            return 0;
          }
        case 'medium':
          if (chapterDifference <= 3 && verseDifference <= 6) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 200;
            } else if (chapterDifference === 0 && verseDifference <= 6) {
              return 150;
            } else if (chapterDifference <= 3 && verseDifference <= 6) {
              return 100;
            } else {
              return 50;
            }
          } else {
            return 0;
          }
        case 'hard':
          if (chapterDifference <= 1 && verseDifference <= 2) {
            if (chapterDifference === 0 && verseDifference === 0) {
              return 300;
            } else if (chapterDifference === 0 && verseDifference <= 2) {
              return 225;
            } else if (chapterDifference <= 1 && verseDifference <= 2) {
              return 150;
            } else {
              return 75;
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
      {Object.keys(verseCounts).map((book) => (
        <button key={book} onClick={() => handleBookSelection(book)} disabled={selectedBook === book}>
          {book}
        </button>
      ))}
    </div>
  );

  const renderChapters = () => {
    if (!selectedBook) return null;

    const chapters = Array.from({ length: verseCounts[selectedBook].length }, (_, index) => index + 1);

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
      <button onClick={handleSubmit} disabled={!selectedBook || !selectedChapter || !selectedVerse}>
        Submit Guess
      </button>
    </div>
  );
}

export default Game;