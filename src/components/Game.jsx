// src/components/Game.jsx

import React, { useState, useEffect } from 'react';
import verses from '../assets/js/verses';
import verseCounts from '../assets/js/verseCounts';
import getDifficultySettings from '../assets/js/difficultySettings'; // Import the difficulty settings
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LiahonaIcon from '/liahona_icon.png';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Game.css';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';

let countNewVerses = 0;

function Game({ difficulty, category, endGame, usedVerses, username }) {
  const savedDifficulty = localStorage.getItem('gameDifficulty') || difficulty;
  const difficultySettings = getDifficultySettings(savedDifficulty);
  const savedScore = localStorage.getItem('gameScore') ? parseInt(localStorage.getItem('gameScore')) : 0;
  const savedLives = localStorage.getItem('gameLives') ? parseInt(localStorage.getItem('gameLives')) : 3;
  const savedBombs = localStorage.getItem('gameBombs') ? parseInt(localStorage.getItem('gameBombs')) : difficultySettings?.bombCount || 3;

  const [score, setScore] = useState(savedScore);
  const [lives, setLives] = useState(savedLives);
  const [bombs, setBombs] = useState(savedBombs);
  const [currentVerse, setCurrentVerse] = useState(localStorage.getItem('gameCurrentVerse') || getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [currentStep, setCurrentStep] = useState('book');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [disabledBooks, setDisabledBooks] = useState([]);
  const [disabledChapters, setDisabledChapters] = useState([]);
  const [disabledVerses, setDisabledVerses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('gameScore', score);
    localStorage.setItem('gameLives', lives);
    localStorage.setItem('gameBombs', bombs);
    localStorage.setItem('gameCurrentVerse', currentVerse);
    localStorage.setItem('gameDifficulty', savedDifficulty);
    saveServedVerse(currentVerse);

    const handlePopState = (event) => {
      if (window.confirm('Are you sure you want to leave? Your game progress will be lost.')) {
        navigate('/');
      } else {
        history.pushState(null, document.title, location.href);
      }
    };

    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, score, lives, bombs, currentVerse, savedDifficulty]);

  function getRandomVerse(needNewVerse) {
    countNewVerses += 1;

    let verseKeys;

    if (category === 'scripture-mastery') {
      verseKeys = Object.keys(scriptureMasteryVerses);
    } else {
      verseKeys = Object.keys(verses);
    }

    if (usedVerses.length >= 25 && category === 'scripture-mastery') {
      endGame(score);
      return null;
    }

    let randomKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];

    while (usedVerses.includes(randomKey)) {
      randomKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];
    }

    if (needNewVerse || countNewVerses === 2) {
      usedVerses.push(randomKey);
    }

    return randomKey;
  }

  function saveServedVerse(verse) {
    const date = new Date().toISOString().split('T')[0];
    const servedVerses = JSON.parse(localStorage.getItem('servedVerses')) || {};

    if (!servedVerses[date]) {
      servedVerses[date] = [];
    }

    if (!servedVerses[date].includes(verse)) {
      servedVerses[date].push(verse);
    }

    localStorage.setItem('servedVerses', JSON.stringify(servedVerses));
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
    setSelectedVerse('');
    setSelectedChapter('');
    if (step === 'book') {
      setSelectedBook('');
    }
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

    const { chapterRange } = difficultySettings || {};

    let newScore = score;
    let lifeLost = false;

    if (guessAccuracy > 0) {
      newScore += guessAccuracy;
      setScore(newScore);
    }

    if (chapterDifference > chapterRange || guess.book !== correctBook) {
      lifeLost = true;
    }

    setModalContent({
      guess,
      correctVerse: currentVerse,
      pointsEarned: guessAccuracy,
      lifeLost,
    });

    setShowModal(true);

    if (lifeLost) {
      setLives((prevLives) => prevLives - 1);
    }
  };

  const handleCloseModal = () => {
    if (lives === 0) {
      endGame(score);
    } else {
      setShowModal(false);
      setCurrentVerse(getRandomVerse(true));
      setSelectedBook('');
      setSelectedChapter('');
      setSelectedVerse('');
      setCurrentStep('book');
      setDisabledBooks([]);
      setDisabledChapters([]);
      setDisabledVerses([]);
    }
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
        console.log(difficulty);
        const { multiplier, chapterRange, verseRange } = difficultySettings || {};

        let accuracy = 0;
        let extraMultiplier = 20;

        if (verseDifference === 0) {
          accuracy += 100 * multiplier;
        }

        if (chapterDifference === 0) {
          accuracy += 50 * multiplier * (extraMultiplier + 5);
          if (verseDifference === 0) {
            accuracy += 100 * multiplier * (extraMultiplier + 5);
          } else if (verseDifference <= verseRange) {
            accuracy += 20 * multiplier * (extraMultiplier - verseDifference);
          }
        } else if (chapterDifference <= chapterRange) {
          accuracy += 30 * multiplier * (extraMultiplier - chapterDifference);
          if (verseDifference <= verseRange) {
            accuracy += 15 * multiplier * (extraMultiplier - verseDifference);
          }
        }

        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
        }
        bestAccuracy /= 10;
      }
    });
    return bestAccuracy;
  };

  const handleUseBomb = () => {
    if (bombs > 0 && canUseBomb()) {
      setBombs(bombs - 1);
      localStorage.setItem('gameBombs', bombs - 1);
      applyBombEffect();
    }
  };

  const canUseBomb = () => {
    const { removeBookCount, removeChapterCount, removeVerseCount } = difficultySettings || {};
    switch (currentStep) {
      case 'book':
        return Object.keys(verseCounts).length > removeBookCount;
      case 'chapter':
        return selectedBook && verseCounts[selectedBook].length > removeChapterCount;
      case 'verse':
        return selectedBook && selectedChapter && verseCounts[selectedBook][selectedChapter - 1] > removeVerseCount;
      default:
        return false;
    }
  };

  const applyBombEffect = () => {
    switch (currentStep) {
      case 'book':
        disableIncorrectBooks();
        break;
      case 'chapter':
        disableIncorrectChapters();
        break;
      case 'verse':
        disableIncorrectVerses();
        break;
      default:
        break;
    }
  };

  const getRandomItems = (items, count) => {
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const disableIncorrectBooks = () => {
    const correctBook = currentVerse.split(' ')[0];
    const allBooks = Object.keys(verseCounts);
    const { removeBookCount } = difficultySettings || {};
    const booksToDisable = getRandomItems(
      allBooks.filter((book) => book !== correctBook && !disabledBooks.includes(book)),
      removeBookCount
    );

    setDisabledBooks(disabledBooks.concat(booksToDisable));
  };

  const disableIncorrectChapters = () => {
    const correctChapter = parseInt(currentVerse.split(':')[0].split(' ')[1]);
    const chapterCount = verseCounts[selectedBook].length;
    const allChapters = Array.from({ length: chapterCount }, (_, index) => index + 1);
    const { removeChapterCount } = difficultySettings || {};
    const chaptersToDisable = getRandomItems(
      allChapters.filter((chapter) => chapter !== correctChapter && !disabledChapters.includes(chapter)),
      removeChapterCount
    );

    setDisabledChapters(disabledChapters.concat(chaptersToDisable));
  };

  const disableIncorrectVerses = () => {
    const correctVerse = parseInt(currentVerse.split(':')[1]);
    const verseCount = verseCounts[selectedBook][selectedChapter - 1];
    const allVerses = Array.from({ length: verseCount }, (_, index) => index + 1);
    const { removeVerseCount } = difficultySettings || {};
    const versesToDisable = getRandomItems(
      allVerses.filter((verse) => verse !== correctVerse && !disabledVerses.includes(verse)),
      removeVerseCount
    );

    setDisabledVerses(disabledVerses.concat(versesToDisable));
  };

  const renderBooks = () => (
    <div className="selection-section">
      <div className='icons-container'>
        <div className='back-container'>
          <IconButton className="back-button" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
        </div>
        <div className='bomb-container'>
          <IconButton
            onClick={handleUseBomb}
            disabled={bombs <= 0 || !canUseBomb()}
            color="primary"
            aria-label="use bomb"
          >
            <img src={LiahonaIcon} alt="liahona" style={{ width: 24, height: 24 }} />
          </IconButton>
          <div id='bomb-count-container'>
            <span id='bomb-count'>{bombs}</span>
          </div>
        </div>
      </div>
      <h3>Book</h3>
      <ScrollIndicatorContainer>
        <div className='options-container'>
          {Object.keys(verseCounts).map((book) => (
            <Button
              variant="outlined"
              key={book}
              onClick={() => handleBookSelection(book)}
              disabled={disabledBooks.includes(book)}
            >
              {book}
            </Button>
          ))}
        </div>
      </ScrollIndicatorContainer>
      <div className="submit-button">
        <Button
          variant="contained"
          disabled={currentStep !== 'verse'}
          onClick={handleSubmit}
        >
          Submit Guess
        </Button>
      </div>
    </div>
  );

  const renderChapters = () => {
    if (!selectedBook) return null;

    const chapterCount = verseCounts[selectedBook].length;
    const chapters = Array.from({ length: chapterCount }, (_, index) => index + 1);

    return (
      <div className="selection-section">
        <div className='icons-container'>
          <div className='back-container'>
            <IconButton className="back-button" onClick={() => handleBack('book')}>
              <ArrowBack />
            </IconButton>
          </div>
          <div className='bomb-container'>
            <IconButton
              onClick={handleUseBomb}
              disabled={bombs <= 0 || !canUseBomb()}
              color="primary"
              aria-label="use bomb"
            >
              <img src={LiahonaIcon} alt="liahona" style={{ width: 24, height: 24 }} />
            </IconButton>
            <div id='bomb-count-container'>
              <span id='bomb-count'>{bombs}</span>
            </div>
          </div>
        </div>
        <h3>Chapter</h3>
        <ScrollIndicatorContainer>
          <div className='options-container'>
            {chapters.map((chapter) => (
              <Button
                variant="outlined"
                key={chapter}
                onClick={() => handleChapterSelection(chapter)}
                disabled={disabledChapters.includes(chapter)}
              >
                {chapter}
              </Button>
            ))}
          </div>
        </ScrollIndicatorContainer>
        <div className="submit-button">
          <Button
            variant="contained"
            disabled={currentStep !== 'verse'}
            onClick={handleSubmit}
          >
            Submit Guess
          </Button>
        </div>
      </div>
    );
  };

  const renderVerses = () => {
    if (!selectedBook || !selectedChapter) return null;

    const verseCount = verseCounts[selectedBook][selectedChapter - 1];
    const verses = Array.from({ length: verseCount }, (_, index) => index + 1);

    const isSubmitEnabled = currentStep === 'verse' && selectedVerse !== '';

    return (
      <div className="selection-section">
        <div className='icons-container'>
          <div className='back-container'>
            <IconButton className="back-button" onClick={() => handleBack('chapter')}>
              <ArrowBack />
            </IconButton>
          </div>
          <div className='bomb-container'>
            <IconButton
              onClick={handleUseBomb}
              disabled={bombs <= 0 || !canUseBomb()}
              color="primary"
              aria-label="use bomb"
            >
              <img src={LiahonaIcon} alt="liahona" style={{ width: 24, height: 24 }} />
            </IconButton>
            <div id='bomb-count-container'>
              <span id='bomb-count'>{bombs}</span>
            </div>
          </div>
        </div>
        <h3>Verse</h3>
        <ScrollIndicatorContainer>
          <div className='options-container'>
            {verses.map((verse) => (
              <Button
                variant="outlined"
                key={verse}
                onClick={() => handleVerseSelection(verse)}
                disabled={disabledVerses.includes(verse)}
              >
                {verse}
              </Button>
            ))}
          </div>
        </ScrollIndicatorContainer>
        <div className="submit-button">
          <Button
            variant="contained"
            disabled={!isSubmitEnabled}
            onClick={handleSubmit}
          >
            Submit Guess
          </Button>
        </div>
      </div>
    );
  };

  const getCurrentVerseText = () => {
    let verseText;
    if (category === 'scripture-mastery') {
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
    <div className='centered-element'>
      <div className="game-container">
        <div className="header">
          <h2 className="score">Score: {score}</h2>
          <h2 className="lives">Lives: {lives}</h2>
        </div>
        <div className="guess-box">
          <p className='guess-text'>
            {selectedBook} {selectedChapter && (selectedVerse ? ` ${selectedChapter}:${selectedVerse}` : selectedChapter)}
          </p>
        </div>
        {getCurrentVerseText()}
        {currentStep === 'book' && renderBooks()}
        {currentStep === 'chapter' && renderChapters()}
        {currentStep === 'verse' && renderVerses()}
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
    </div>
  );
}

export default Game;