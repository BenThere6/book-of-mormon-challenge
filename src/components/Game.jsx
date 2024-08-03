import React, { useState, useEffect } from 'react';
import verses from '../assets/js/verses';
import verseCounts from '../assets/js/verseCounts';
import getDifficultySettings from '../assets/js/difficultySettings';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import KeyboardTab from '@mui/icons-material/KeyboardTab';
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
  const savedSkips = localStorage.getItem('gameSkips') ? parseInt(localStorage.getItem('gameSkips')) : difficultySettings?.skipCount || 3;

  const [score, setScore] = useState(savedScore);
  const [lives, setLives] = useState(savedLives);
  const [bombs, setBombs] = useState(savedBombs);
  const [skips, setSkips] = useState(savedSkips);
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
    localStorage.setItem('gameSkips', skips);
    localStorage.setItem('gameCurrentVerse', currentVerse);
    localStorage.setItem('gameDifficulty', savedDifficulty);

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
  }, [navigate, score, lives, bombs, skips, currentVerse, savedDifficulty]);

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

  function saveVerseToHistory(verse, isCorrect) {
    const date = new Date().toISOString().split('T')[0];
    const gameID = JSON.parse(localStorage.getItem('currentGameID'));
    const verseHistory = JSON.parse(localStorage.getItem('verseHistory')) || {};

    if (!verseHistory[date]) {
      verseHistory[date] = {};
    }

    if (!verseHistory[date][gameID]) {
      verseHistory[date][gameID] = [];
    }

    // Save the verse with its status (correct, incorrect, or skipped)
    verseHistory[date][gameID].push({ verse, isCorrect });

    localStorage.setItem('verseHistory', JSON.stringify(verseHistory));
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
    
    const correctBook = extractBookFromVerse(currentVerse);
    const correctChapterVerse = extractChapterVerseFromVerse(currentVerse);
    const correctChapter = parseInt(correctChapterVerse.split(':')[0], 10);
    const chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);
    
    const { chapterRange } = difficultySettings || {};
    
    let newScore = score;
    let isCorrect = false;
    
    let lifeLost = false;
    
    if (chapterDifference > chapterRange || guess.book !== correctBook) {
      lifeLost = true;
    } else {
      if (guessAccuracy > 0) {
        newScore += guessAccuracy;
        newScore = Math.round(newScore); // Round the new score
        setScore(newScore);
        isCorrect = true;
      }
    }
    
    setModalContent({
      guess,
      correctVerse: currentVerse,
      pointsEarned: lifeLost ? 0 : guessAccuracy,
      lifeLost,
    });
    
    setShowModal(true);
    
    saveVerseToHistory(currentVerse, isCorrect);
    
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
    const correctBook = extractBookFromVerse(firstVerseEntry);
    const correctChapterVerse = extractChapterVerseFromVerse(firstVerseEntry);

    let bestAccuracy = 0;
    let chapterDifference;
    let verseDifference;

    verseList.forEach((verseEntry) => {
      const [correctChapterStr, correctVerseNumStr] = correctChapterVerse.split(':');
      const correctChapter = parseInt(correctChapterStr, 10);
      verseDifference = Math.abs(parseInt(guess.verse, 10) - parseInt(correctVerseNumStr, 10));
      chapterDifference = Math.abs(parseInt(guess.chapter, 10) - correctChapter);

      if (guess.book === correctBook) {
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
    return Math.round(bestAccuracy); // Round the accuracy score
  };

  const extractBookFromVerse = (verse) => {
    const refSplit = verse.split(' ');
    if (refSplit[0][0] >= '1' && refSplit[0][0] <= '4') {
      return refSplit.slice(0, 2).join(' ');
    } else if (refSplit.length > 2 && refSplit[2].includes(':')) {
      return refSplit.slice(0, 2).join(' ');
    } else {
      return refSplit[0];
    }
  };

  const extractChapterVerseFromVerse = (verse) => {
    const refSplit = verse.split(' ');
    return refSplit[refSplit.length - 1];
  };

  const handleUseBomb = () => {
    if (canUseBomb()) {
      setBombs(bombs - 1);
      localStorage.setItem('gameBombs', bombs - 1);
      applyBombEffect();
    }
  };

  const handleUseSkip = () => {
    if (canUseSkip()) {
      setSkips(skips - 1);
      localStorage.setItem('gameSkips', skips - 1);
      saveVerseToHistory(currentVerse, null);
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

  const canUseBomb = () => {
    if (bombs <= 0) return false;

    let availableOptions;
    switch (currentStep) {
      case 'book':
        availableOptions = Object.keys(verseCounts).filter(book => !disabledBooks.includes(book));
        break;
      case 'chapter':
        availableOptions = verseCounts[selectedBook]?.filter((_, index) => !disabledChapters.includes(index + 1));
        break;
      case 'verse':
        availableOptions = Array.from({ length: verseCounts[selectedBook][selectedChapter - 1] }, (_, index) => index + 1)
          .filter(verse => !disabledVerses.includes(verse));
        break;
      default:
        return false;
    }

    return availableOptions.length >= 1;
  };

  const canUseSkip = () => {
    return skips > 0;
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
    const correctBook = extractBookFromVerse(currentVerse);
    const allBooks = Object.keys(verseCounts);
    const filteredBooks = allBooks.filter((book) => book !== correctBook && !disabledBooks.includes(book));

    // Ensure we do not disable the correct book
    if (filteredBooks.length <= 0) return;

    const removeCount = Math.ceil((filteredBooks.length) * (difficultySettings.removePercentage / 100));
    let booksToDisable = getRandomItems(filteredBooks, removeCount);

    // Re-check and remove correct book if mistakenly included
    while (booksToDisable.includes(correctBook)) {
      booksToDisable = getRandomItems(filteredBooks, removeCount);
    }

    setDisabledBooks(disabledBooks.concat(booksToDisable));
  };

  const disableIncorrectChapters = () => {
    const correctChapter = parseInt(currentVerse.split(':')[0].split(' ')[1]);
    const chapterCount = verseCounts[selectedBook].length;
    const allChapters = Array.from({ length: chapterCount }, (_, index) => index + 1);
    const filteredChapters = allChapters.filter((chapter) => chapter !== correctChapter && !disabledChapters.includes(chapter));

    // Ensure we do not disable the correct chapter
    if (filteredChapters.length <= 0) return;

    const removeCount = Math.ceil((filteredChapters.length) * (difficultySettings.removePercentage / 100));
    let chaptersToDisable = getRandomItems(filteredChapters, removeCount);

    // Re-check and remove correct chapter if mistakenly included
    while (chaptersToDisable.includes(correctChapter)) {
      chaptersToDisable = getRandomItems(filteredChapters, removeCount);
    }

    setDisabledChapters(disabledChapters.concat(chaptersToDisable));
  };

  const disableIncorrectVerses = () => {
    const correctVerse = parseInt(currentVerse.split(':')[1]);
    const verseCount = verseCounts[selectedBook][selectedChapter - 1];
    const allVerses = Array.from({ length: verseCount }, (_, index) => index + 1);
    const filteredVerses = allVerses.filter((verse) => verse !== correctVerse && !disabledVerses.includes(verse));

    // Ensure we do not disable the correct verse
    if (filteredVerses.length <= 0) return;

    const removeCount = Math.ceil((filteredVerses.length) * (difficultySettings.removePercentage / 100));
    let versesToDisable = getRandomItems(filteredVerses, removeCount);

    // Re-check and remove correct verse if mistakenly included
    while (versesToDisable.includes(correctVerse)) {
      versesToDisable = getRandomItems(filteredVerses, removeCount);
    }

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
        <div className='powerups-container'>
          <div className='bomb-container'>
            <IconButton
              onClick={handleUseBomb}
              disabled={!canUseBomb()}
              className={!canUseBomb() ? 'bomb-button-disabled' : ''}
              color="primary"
              aria-label="use bomb"
            >
              <img src={LiahonaIcon} alt="liahona" style={{ width: 24, height: 24 }} />
            </IconButton>
            <div id='bomb-count-container'>
              <span id='bomb-count'>{bombs}</span>
            </div>
          </div>
          <div className='skip-container'>
            <IconButton
              onClick={handleUseSkip}
              disabled={!canUseSkip()}
              className={!canUseSkip() ? 'skip-button-disabled' : ''}
              color="black"
              aria-label="use skip"
            >
              <KeyboardTab />
            </IconButton>
            <div id='skip-count-container'>
              <span id='skip-count'>{skips}</span>
            </div>
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
          <div className='powerups-container'>
            <div className='bomb-container'>
              <IconButton
                onClick={handleUseBomb}
                disabled={!canUseBomb()}
                className={!canUseBomb() ? 'bomb-button-disabled' : ''}
                color="primary"
                aria-label="use bomb"
              >
                <img src={LiahonaIcon} alt="liahona" style={{ width: 24, height: 24 }} />
              </IconButton>
              <div id='bomb-count-container'>
                <span id='bomb-count'>{bombs}</span>
              </div>
            </div>
            <div className='skip-container'>
              <IconButton
                onClick={handleUseSkip}
                disabled={!canUseSkip()}
                className={!canUseSkip() ? 'skip-button-disabled' : ''}
                color="black"
                aria-label="use skip"
              >
                <KeyboardTab />
              </IconButton>
              <div id='skip-count-container'>
                <span id='skip-count'>{skips}</span>
              </div>
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
          <div className='powerups-container'>
            <div className='bomb-container'>
              <IconButton
                onClick={handleUseBomb}
                disabled={!canUseBomb()}
                className={!canUseBomb() ? 'bomb-button-disabled' : ''}
                color="primary"
                aria-label="use bomb"
              >
                <img src={LiahonaIcon} alt="liahona" style={{ width: 24, height: 24 }} />
              </IconButton>
              <div id='bomb-count-container'>
                <span id='bomb-count'>{bombs}</span>
              </div>
            </div>
            <div className='skip-container'>
              <IconButton
                onClick={handleUseSkip}
                disabled={!canUseSkip()}
                className={!canUseSkip() ? 'skip-button-disabled' : ''}
                color="black"
                aria-label="use skip"
              >
                <KeyboardTab />
              </IconButton>
              <div id='skip-count-container'>
                <span id='skip-count'>{skips}</span>
              </div>
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className='centered-element'>
      <div className="game-container">
        <div className="header">
          <h2 className="score">Score: {score}</h2>
          <h2 className='score'>{capitalizeFirstLetter(savedDifficulty)}</h2>
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