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
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import '../assets/css/Game.css';

const imageUrls = [
  'background-images/alma-baptizing.jpg',
  'background-images/alma-the-younger.jpg',
  'background-images/ammon.jpg',
  'background-images/brother-of-jared.jpg',
  'background-images/christ-in-america.jpg',
  'background-images/king-benjamin.jpg',
  'background-images/mound-battle.jpg',
  'background-images/stripling-warriors.jpg',
  'background-images/nephi-on-ship.jpg',
];

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
  const [notification, setNotification] = useState({ show: false, message: '', timerId: null, visible: false });
  const [currentVerse, setCurrentVerse] = useState(localStorage.getItem('gameCurrentVerse') || getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [currentStep, setCurrentStep] = useState('book');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [disabledBooks, setDisabledBooks] = useState([]);
  const [disabledChapters, setDisabledChapters] = useState([]);
  const [disabledVerses, setDisabledVerses] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(getRandomImage());
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

  const showNotification = (message) => {
    // Clear existing timer if present
    if (notification.timerId) {
      clearTimeout(notification.timerId);
    }
  
    // Set new notification state and timer
    const timerId = setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false, timerId: null, visible: false }));
    }, 5000);
  
    setNotification({ show: true, message, timerId, visible: true });
  };
  
  const Notification = ({ show, message, visible }) => (
    <div className={`notification ${show && visible ? 'show' : ''}`}>
      {message}
    </div>
  );  
  
  function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  }

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
    setTimeout(() => {
      setSelectedBook(book);
      setSelectedChapter('');
      setSelectedVerse('');
      setCurrentStep('chapter');
      document.activeElement.blur(); // remove focus from the button
    }, 100); // 1/2 second delay
  }

  function handleChapterSelection(chapter) {
    setTimeout(() => {
      setSelectedChapter(chapter);
      setSelectedVerse('');
      setCurrentStep('verse');
      document.activeElement.blur(); // remove focus from the button
    }, 100); // 1/2 second delay
  }

  function handleVerseSelection(verse) {
    setTimeout(() => {
      setSelectedVerse(verse);
      document.activeElement.blur(); // remove focus from the button
    }, 100); // 1/2 second delay
  }

  const handleBack = () => {
    // Hide the notification when the back button is clicked
    setNotification((prev) => ({ ...prev, visible: false }));
  
    if (currentStep === 'book') {
      setShowConfirmation(true);
    } else if (currentStep === 'chapter') {
      setSelectedChapter('');
      setSelectedVerse('');
      setCurrentStep('book');
    } else if (currentStep === 'verse') {
      setSelectedChapter('');
      setSelectedVerse('');
      setCurrentStep('chapter');
    }
  };
  
  const handleConfirmBack = () => {
    navigate('/');
  };

  const handleCancelBack = () => {
    setShowConfirmation(false);
  };

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

  const handleSkipModalClose = () => {
    setShowModal(false);
    setCurrentVerse(getRandomVerse(true));
    setSelectedBook('');
    setSelectedChapter('');
    setSelectedVerse('');
    setCurrentStep('book');
    setDisabledBooks([]);
    setDisabledChapters([]);
    setDisabledVerses([]);
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
    const bookMatch = verse.match(/^[1-4]?\s?[a-zA-Z]+(\s[a-zA-Z]+)*/);
    if (bookMatch) {
      return bookMatch[0].trim();
    }
    return '';
  };
  
  const extractChapterVerseFromVerse = (verse) => {
    const refSplit = verse.split(' ');
    return refSplit[refSplit.length - 1];
  };

  const parseChapterFromVerse = (verse) => {
    const verseParts = verse.split(':');
    if (verseParts.length < 2) {
      throw new Error('Unexpected verse format: ' + verse);
    }
  
    const chapterPart = verseParts[0].split(' ');
    const chapter = parseInt(chapterPart[chapterPart.length - 1]);
    
    if (isNaN(chapter)) {
      throw new Error('Parsed chapter is NaN: ' + verse);
    }
  
    return chapter;
  };  

  const handleUseBomb = () => {
    if (canUseBomb()) {
      setBombs(bombs - 1);
      localStorage.setItem('gameBombs', bombs - 1);
  
      const correctBook = extractBookFromVerse(currentVerse);
      const correctChapter = parseChapterFromVerse(currentVerse);
  
      if (currentStep === 'chapter' && selectedBook !== correctBook) {
        showNotification('You are in the wrong book!');
        applyBombEffect();
      } else if (currentStep === 'verse' && (selectedBook !== correctBook || selectedChapter !== correctChapter)) {
        console.log(':'+selectedBook + correctBook+':')
        console.log(':'+selectedChapter + correctChapter+':')
        showNotification('You are in the wrong chapter or book!');
        applyBombEffect();
      }
      applyBombEffect();
    }
  };
  
  const handleUseSkip = () => {
    if (canUseSkip()) {
      setSkips(skips - 1);
      localStorage.setItem('gameSkips', skips - 1);
      saveVerseToHistory(currentVerse, null);
      setModalContent({
        skippedVerse: currentVerse
      });
      setShowModal(true);
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
    // const correctBook = extractBookFromVerse(currentVerse);
    // const correctChapter = parseChapterFromVerse(currentVerse);
  
    // if ((currentStep === 'chapter' && selectedBook !== correctBook) ||
    //     (currentStep === 'verse' && (selectedBook !== correctBook || selectedChapter !== correctChapter.toString()))) {
    //   showNotification('You are in the wrong chapter or book!');
    // } else {
    //   setNotification((prev) => ({ ...prev, visible: false }));
    // }
  
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
    let correctChapter;
  
    try {
      correctChapter = parseChapterFromVerse(currentVerse);
    } catch (error) {
      console.error(error.message);
      return;
    }
  
    const chapterCount = verseCounts[selectedBook].length;
    const allChapters = Array.from({ length: chapterCount }, (_, index) => index + 1);
    const filteredChapters = allChapters.filter((chapter) => chapter !== correctChapter && !disabledChapters.includes(chapter));
  
    if (filteredChapters.length <= 0) return;
  
    const removeCount = Math.ceil(filteredChapters.length * (difficultySettings.removePercentage / 100));
    let chaptersToDisable = getRandomItems(filteredChapters, removeCount);
  
    console.log('correct chapter:', correctChapter);
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

  const renderBooks = () => {
    return (
      <div className='options-container' style={{ overflowY: 'auto' }}>
        {Object.keys(verseCounts).map((book) => (
          <Button
            variant='outlined'
            key={book}
            onClick={() => handleBookSelection(book)}
            disabled={disabledBooks.includes(book)}
            sx={{
              '&:hover': {
                backgroundColor: 'initial',
                color: 'white',
                borderColor: 'white'
              },
              color: 'white',
              borderColor: 'white',
            }}
            className='option-button'
          >
            {book}
          </Button>
        ))}
      </div>
    );
  };

  const renderChapters = () => {
    if (!selectedBook) return null;

    const chapterCount = verseCounts[selectedBook].length;
    const chapters = Array.from({ length: chapterCount }, (_, index) => index + 1);

    return (
      <div className='options-container' style={{ overflowY: 'auto' }}>
        {chapters.map((chapter) => (
          <Button
            variant='outlined'
            key={chapter}
            onClick={() => handleChapterSelection(chapter)}
            disabled={disabledChapters.includes(chapter)}
            sx={{
              color: 'white', borderColor: 'white', '&:hover': {
                backgroundColor: 'initial',
                color: 'white',
                borderColor: 'white'
              }
            }}
            className='option-button'
          >
            {chapter}
          </Button>
        ))}
      </div>
    );
  };

  const renderVerses = () => {
    if (!selectedBook || !selectedChapter) return null;

    const verseCount = verseCounts[selectedBook][selectedChapter - 1];
    const verses = Array.from({ length: verseCount }, (_, index) => index + 1);

    return (
      <div className='options-container' style={{ overflowY: 'auto' }}>
        {verses.map((verse) => (
          <Button
            variant='outlined'
            key={verse}
            onClick={() => handleVerseSelection(verse)}
            disabled={disabledVerses.includes(verse)}
            sx={{
              color: 'white', borderColor: 'white', '&:hover': {
                backgroundColor: 'initial',
                color: 'white',
                borderColor: 'white'
              }
            }}
            className='option-button'
          >
            {verse}
          </Button>
        ))}
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
      <div className='verse-text-container'>
        {versesArray.map((verse, index) => (
          <p className='verse-text' key={index}>
            {verse}
          </p>
        ))}
      </div>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const isSubmitEnabled = currentStep === 'verse' && selectedVerse !== '';

  return (
    <div className='game-page' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <Notification show={notification.show} message={notification.message} visible={notification.visible} />
      <div id='game-container'>
        <div className='game-content'>
          <div className='header'>
            <div id='score-text'>{score}</div>
            <div id='difficulty-text'>{capitalizeFirstLetter(savedDifficulty)}</div>
            <div id='lives-container'>
              <span id='lives-text'>{lives}</span>
              <FavoriteBorderOutlinedIcon sx={{ color: 'white', marginRight: '5px' }} />
            </div>
          </div>
          <div id='guess-container'>
            <p>
              {selectedBook} {selectedChapter && (selectedVerse ? `${selectedChapter}:${selectedVerse}` : selectedChapter)}
              {!selectedBook && <span className="placeholder">(Your guess here)</span>}
            </p>
          </div>
          {getCurrentVerseText()}
          <div className='goal-container'>
            Get correct book and within {difficultySettings.chapterRange} of correct chapter.
          </div>
          <div className='icons-container'>
            <div className='back-container'>
              <IconButton className='back-button' onClick={handleBack}>
                <ArrowBack sx={{ color: 'white' }} />
              </IconButton>
            </div>
            <div className='step-name'>
              {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
            </div>
            <div className='powerups-container'>
              <div className='bomb-container'>
                <IconButton
                  onClick={handleUseBomb}
                  disabled={!canUseBomb()}
                  className={!canUseBomb() ? 'bomb-button-disabled' : ''}
                  aria-label='use bomb'
                >
                  <ExploreOutlinedIcon sx={{ color: canUseBomb() ? 'white' : 'gray' }} />
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
                  aria-label='use skip'
                >
                  <KeyboardTab sx={{ color: canUseSkip() ? 'white' : 'gray' }} />
                </IconButton>
                <div id='skip-count-container'>
                  <span id='skip-count'>{skips}</span>
                </div>
              </div>
            </div>
          </div>
          {currentStep === 'book' && renderBooks()}
          {currentStep === 'chapter' && renderChapters()}
          {currentStep === 'verse' && renderVerses()}
        </div>
        <div className='submit-button'>
          <Button variant='outlined' disabled={!isSubmitEnabled} sx={{ borderColor: 'white', color: 'white' }} onClick={handleSubmit}>
            Submit Guess
          </Button>
        </div>
        <Dialog open={showModal} onClose={modalContent.skippedVerse ? handleSkipModalClose : handleCloseModal}>
          <DialogTitle>{modalContent.skippedVerse ? "Verse Skipped" : "Guess Results"}</DialogTitle>
          <DialogContent>
            {modalContent.skippedVerse ? (
              <>
                <DialogContentText>
                  {modalContent.skippedVerse}
                </DialogContentText>
              </>
            ) : (
              <>
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
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={modalContent.skippedVerse ? handleSkipModalClose : handleCloseModal} color='primary'>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showConfirmation} onClose={handleCancelBack}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to go back? Your game progress will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelBack} color='primary'>
              Cancel
            </Button>
            <Button onClick={handleConfirmBack} color='primary' autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Game;