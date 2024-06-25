import React, { useState } from 'react';
import verses from '../verses';
import verseCounts from '../verseCounts';
import scriptureMasteryVerses from '../scriptureMasteryVerses';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../Game.css';

function Game({ difficulty, endGame }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentVerse, setCurrentVerse] = useState(getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [currentStep, setCurrentStep] = useState('book');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  function getRandomVerse() {
    let keys;
    if (difficulty === 'easy') {
      keys = Object.keys(scriptureMasteryVerses);
    } else {
      keys = Object.keys(verses);
    }

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return randomKey;
  }

  function handleBookSelection(book) {
    setSelectedBook(book);
    setSelectedChapter('');
    setSelectedVerse('');
    setCurrentStep('chapter');
  }

  function handleChapterSelection(chapter) {
    setSelectedChapter(chapter);
    setSelectedVerse('');
    setCurrentStep('verse');
  }

  function handleVerseSelection(verse) {
    setSelectedVerse(verse);
  }

  function handleBack(step) {
    setCurrentStep(step);
  }

  const handleSubmit = () => {
    const guess = { book: selectedBook, chapter: selectedChapter, verse: selectedVerse };
    const guessAccuracy = calculateAccuracy(guess, currentVerse);

    const lastSpaceIndex = currentVerse.lastIndexOf(' ');
    const refSplit = currentVerse.split(' ');
    let correctBook;
    if (refSplit[0][0] === '1' || refSplit[0][0] === '2' || refSplit[0][0] === '3' || refSplit[0][0] === '4') {
      correctBook = refSplit[0] + ' ' + refSplit[1];
    } else {
      correctBook = refSplit[0];
    }
    const correctChapterVerse = currentVerse.substring(lastSpaceIndex + 1);
    const [correctChapterStr] = correctChapterVerse.split(':');
    const correctChapter = parseInt(correctChapterStr, 10);
    const chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);

    const { chapterRange } = getDifficultySettings(difficulty);

    let newScore = score;
    let lifeLost = false;

    if (guessAccuracy > 0) {
      newScore += guessAccuracy;
      setScore(newScore);
    }

    if (chapterDifference > chapterRange || guess.book !== correctBook) {
      lifeLost = true;
      setLives((prevLives) => prevLives - 1);
      if (lives === 1) {
        endGame(newScore);
        return;
      }
    }

    setModalContent({
      guess,
      correctVerse: currentVerse,
      pointsEarned: guessAccuracy,
      lifeLost,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentVerse(getRandomVerse());
    setSelectedBook('');
    setSelectedChapter('');
    setSelectedVerse('');
    setCurrentStep('book');
  };

  const calculateAccuracy = (guess, verseToCheck) => {
    let verseList;
    if (verseToCheck.includes(', ')) {
      verseList = verseToCheck.split(', ').map((entry) => entry.trim());
    } else {
      verseList = [verseToCheck];
    }

    const firstVerseEntry = verseList[0];
    const lastSpaceIndex = firstVerseEntry.lastIndexOf(' ');
    const correctBook = firstVerseEntry.substring(0, lastSpaceIndex);
    const correctChapterVerse = firstVerseEntry.substring(lastSpaceIndex + 1);
    const [correctChapterStr] = correctChapterVerse.split(':');

    let bestAccuracy = 0;
    let chapterDifference;
    let verseDifference;

    verseList.forEach((verseEntry) => {
      const [correctChapterStr, correctVerseNumStr] = verseEntry.split(':');
      const refList = correctChapterStr.split(' ');
      const correctChapter = refList[refList.length - 1];
      verseDifference = Math.abs(parseInt(guess.verse, 10) - parseInt(correctVerseNumStr, 10));
      chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);

      if (guess.book === correctBook) {
        const { multiplier, chapterRange, verseRange } = getDifficultySettings(difficulty);

        let accuracy = 15 * multiplier;

        if (chapterDifference === 0) {
          accuracy += 50 * multiplier;
        } else if (chapterDifference <= chapterRange) {
          accuracy += 30 * multiplier;
        }

        if (verseDifference === 0) {
          if (chapterDifference <= chapterRange) {
            accuracy += 100 * multiplier;
          } else {
            accuracy += 100 * multiplier / 4;
          }
        } else if (verseDifference <= verseRange) {
          if (chapterDifference <= chapterRange) {
            accuracy += 50 * multiplier;
          } else {
            accuracy += 50 * multiplier / 4;
          }
        }

        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
        }
      }
    });

    return bestAccuracy;
  };

  const getDifficultySettings = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { multiplier: 1, chapterRange: 8, verseRange: 12 };
      case 'medium':
        return { multiplier: 8, chapterRange: 7, verseRange: 10 };
      case 'hard':
        return { multiplier: 12, chapterRange: 3, verseRange: 8 };
      default:
        console.log('Invalid difficulty level');
        return { multiplier: 1, chapterRange: 8, verseRange: 12 };
    }
  };

  const renderBooks = () => (
    <div className="selection-section">
      <h3>Select Book:</h3>
      {Object.keys(verseCounts).map((book) => (
        <Button variant="outlined" key={book} onClick={() => handleBookSelection(book)}>
          {book}
        </Button>
      ))}
    </div>
  );

  const renderChapters = () => {
    if (!selectedBook) return null;

    const chapterCount = verseCounts[selectedBook].length;
    const chapters = Array.from({ length: chapterCount }, (_, index) => index + 1);

    return (
      <div className="selection-section">
        <h3>{selectedBook}</h3>
        <h3>Select Chapter:</h3>
        {chapters.map((chapter) => (
          <Button variant="outlined" key={chapter} onClick={() => handleChapterSelection(chapter)}>
            {chapter}
          </Button>
        ))}
        <Button variant="contained" onClick={() => handleBack('book')}>
          Back
        </Button>
      </div>
    );
  };

  const renderVerses = () => {
    if (!selectedBook || !selectedChapter) return null;

    const verseCount = verseCounts[selectedBook][selectedChapter - 1];
    const verses = Array.from({ length: verseCount }, (_, index) => index + 1);

    return (
      <div className="selection-section">
        <h3>
          {selectedBook} {selectedChapter}:{selectedVerse}
        </h3>
        <h3>Select Verse:</h3>
        {verses.map((verse) => (
          <Button
            variant="outlined"
            key={verse}
            onClick={() => handleVerseSelection(verse)}
          >
            {verse}
          </Button>
        ))}
        <Button variant="contained" onClick={() => handleBack('chapter')}>
          Back
        </Button>
      </div>
    );
  };

  const getCurrentVerseText = () => {
    let verseText;
    if (difficulty === 'easy') {
      verseText = scriptureMasteryVerses[currentVerse];
    } else {
      verseText = verses[currentVerse];
    }

    if (!verseText) {
      console.log(`Verse Not Found for key: ${currentVerse}`);
      return 'Verse Not Found';
    }

    const versesArray = verseText.split('\n\n');

    return (
      <div className="verse-text">
        {versesArray.map((verse, index) => (
          <p key={index}>{verse}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="header">
        <h2 className="score">Score: {score}</h2>
        <h2 className="lives">Lives: {lives}</h2>
      </div>
      {getCurrentVerseText()}
      {currentStep === 'book' && renderBooks()}
      {currentStep === 'chapter' && renderChapters()}
      {currentStep === 'verse' && renderVerses()}
      {selectedVerse !== '' && (
        <div className="submit-button">
          <Button variant="contained" onClick={handleSubmit}>
            Submit Guess
          </Button>
        </div>
      )}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Guess Results</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your Guess: {modalContent.guess && `${modalContent.guess.book} ${modalContent.guess.chapter}:${modalContent.guess.verse}`}
          </DialogContentText>
          <DialogContentText>
            Correct Verse: {modalContent.correctVerse}
          </DialogContentText>
          <DialogContentText>
            Points Earned: {modalContent.pointsEarned}
          </DialogContentText>
          {modalContent.lifeLost && (
            <DialogContentText>
              You lost a life!
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Game;