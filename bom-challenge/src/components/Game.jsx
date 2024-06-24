import React, { useState } from 'react';
import verses from '../verses';
import verseCounts from '../verseCounts';
import scriptureMasteryVerses from '../scriptureMasteryVerses'; // Importing the updated verses

function Game({ difficulty, endGame }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentVerse, setCurrentVerse] = useState(getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');

  function getRandomVerse() {
    const keys = Object.keys(scriptureMasteryVerses);
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
    // console.log('Submitting guess with:', selectedBook, selectedChapter, selectedVerse);

    const guess = { book: selectedBook, chapter: selectedChapter, verse: selectedVerse };
    const guessAccuracy = calculateAccuracy(guess, currentVerse);

    const lastSpaceIndex = currentVerse.lastIndexOf(' ');
    const refSplit = currentVerse.split(' ');
    let correctBook;
    if (refSplit[0][0] == 1 || refSplit[0][0] == 2 || refSplit[0][0] == 3 || refSplit[0][0] == 4) {
      correctBook = refSplit[0] + ' ' + refSplit[1];
    } else {
      correctBook = refSplit[0];
    }
    const correctChapterVerse = currentVerse.substring(lastSpaceIndex + 1);

    const [correctChapterStr] = correctChapterVerse.split(':');
    const correctChapter = parseInt(correctChapterStr, 10);

    const chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);

    const { chapterRange } = getDifficultySettings(difficulty);

    // Update score before checking lives
    let newScore = score;
    if (guessAccuracy > 0) {
      newScore += guessAccuracy;
      console.log('Score updated. New score:', newScore);
      setScore(newScore); // Update score here
    }

    // Check lives after updating score
    if (chapterDifference > chapterRange || guess.book !== correctBook) {
      // console.log("chapterDifference, chapterRange, guess.book, correctBook:")
      // console.log(chapterDifference)
      // console.log(chapterRange)
      // console.log(guess.book)
      // console.log(correctBook)
      setLives((prevLives) => prevLives - 1); // Decrement lives
      console.log('Life lost. Remaining lives:', lives - 1);
      if (lives === 1) {
        endGame(newScore); // End game with updated score
        return;
      }
    }

    // Reset state for next round
    setCurrentVerse(getRandomVerse());
    setSelectedBook('');
    setSelectedChapter('');
    setSelectedVerse('');
  };

  const calculateAccuracy = (guess, verseToCheck) => {
    console.log('Calculating accuracy for guess:', guess.book + ' ' + guess.chapter + ':' + guess.verse, 'to verse:', verseToCheck);
  
    let verseList;
    if (verseToCheck.includes(', ')) {
      verseList = verseToCheck.split(', ').map(entry => entry.trim());
    } else {
      verseList = [verseToCheck]; // If only one verse, put it into an array
    }

    // Get details from the first verse in the list
    const firstVerseEntry = verseList[0];
    const lastSpaceIndex = firstVerseEntry.lastIndexOf(' ');
    const correctBook = firstVerseEntry.substring(0, lastSpaceIndex);
    const correctChapterVerse = firstVerseEntry.substring(lastSpaceIndex + 1);
  
    const [correctChapterStr] = correctChapterVerse.split(':');
    const correctChapter = parseInt(correctChapterStr, 10);
  
    // Initialize variables to track the best accuracy
    let bestAccuracy = 0;
    let chapterDifference;
    let verseDifference;
  
    verseList.forEach(verseEntry => {
      const [correctChapterStr, correctVerseNumStr] = verseEntry.split(':');
      const refList = correctChapterStr.split(' ');
      const correctChapter = refList[refList.length - 1]
      // console.log(correctChapter, correctChapterStr)
      // var string_split = correctChapterStr.split(' ')
      // console.log(string_split)
      // console.log(string_split[string_split.length - 1])
      const correctVerseNum = parseInt(correctVerseNumStr, 10);
  
      chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);
      console.log('chapter guess: '+guess.chapter)
      console.log('correct chapter: '+correctChapter)
      verseDifference = Math.abs(parseInt(guess.verse, 10) - correctVerseNum);
  
      if (guess.book === correctBook) {
        const { multiplier, chapterRange, verseRange } = getDifficultySettings(difficulty);
  
        let accuracy = 15 * multiplier;
        console.log('Guessed the correct book. +', 15 * multiplier, 'points.');
  
        if (chapterDifference === 0) {
          accuracy += 50 * multiplier;
          console.log('Guessed the correct chapter exactly. +', 50 * multiplier, 'points.');
        } else if (chapterDifference <= chapterRange) {
          accuracy += 30 * multiplier;
          console.log('Guessed the chapter within range. +', 30 * multiplier, 'points.');
        }
  
        if (verseDifference === 0) {
          if (chapterDifference <= chapterRange) {
            accuracy += 100 * multiplier;
            console.log('Guessed the correct verse exactly. +', 100 * multiplier, 'points.');
          } else {
            accuracy += 100 * multiplier / 4;
            console.log('Guessed the correct verse exactly, but chapter was off. +', 100 * multiplier / 4, 'points.');
          }
        } else if (verseDifference <= verseRange) {
          if (chapterDifference <= chapterRange) {
            accuracy += 50 * multiplier;
            console.log('Guessed the verse within range. +', 50 * multiplier, 'points.');
          } else {
            accuracy += 50 * multiplier / 4;
            console.log('Guessed the verse within range, but chapter was off. +', 50 * multiplier / 4, 'points.');
          }
        }
  
        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
        }
      }
    });
  
    if (bestAccuracy > 0) {
      console.log('Total accuracy calculated:', bestAccuracy);
      return bestAccuracy;
    } else {
      console.log('Guessed the wrong book. Accuracy calculated: 0');
      return 0;
    }
  };
  
  const getDifficultySettings = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { multiplier: 1, chapterRange: 2, verseRange: 5 };
      case 'medium':
        return { multiplier: 8, chapterRange: 7, verseRange: 10 };
      case 'hard':
        return { multiplier: 12, chapterRange: 2, verseRange: 3 };
      default:
        console.log("Invalid difficulty level");
        return { multiplier: 1, chapterRange: 2, verseRange: 5 };
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
    const verseText = scriptureMasteryVerses[currentVerse];
    if (!verseText) {
      console.log(`Verse Not Found for key: ${currentVerse}`);
      return 'Verse Not Found';
    }

    // Split verses by double newline to handle multiple verses
    const versesArray = verseText.split('\n\n');

    return (
      <div>
        {versesArray.map((verse, index) => (
          <p key={index}>{verse}</p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>Score: {score}</h2>
      <h2>Lives: {lives}</h2>
      <div>{getCurrentVerseText()}</div>
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