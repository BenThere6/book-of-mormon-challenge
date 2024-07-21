import React, { useState, useEffect } from 'react';
import verses from '../assets/js/verses';
import verseCounts from '../assets/js/verseCounts';
import scriptureMasteryVerses from '../assets/js/scriptureMasteryVerses';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Game.css';

let countNewVerses = 0;

function Game({ difficulty, category, endGame, usedVerses, username }) {
  const [score, setScore] = useState(localStorage.getItem('gameScore') ? parseInt(localStorage.getItem('gameScore')) : 0);
  const [lives, setLives] = useState(localStorage.getItem('gameLives') ? parseInt(localStorage.getItem('gameLives')) : 3);
  const [currentVerse, setCurrentVerse] = useState(localStorage.getItem('gameCurrentVerse') || getRandomVerse());
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [currentStep, setCurrentStep] = useState('book');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('gameScore', score);
    localStorage.setItem('gameLives', lives);
    localStorage.setItem('gameCurrentVerse', currentVerse);

    const handlePopState = (event) => {
      if (window.confirm('Are you sure you want to leave? Your game progress will be lost.')) {
        // Allow the navigation
        navigate('/')
      } else {
        // Prevent the navigation
        history.pushState(null, document.title, location.href);
      }
    };

    // Initial push state to prevent immediate navigation
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, score, lives, currentVerse]);

  function getRandomVerse(needNewVerse) {
    countNewVerses += 1;
  
    let verseKeys;
  
    if (category === 'scripture-mastery') {
      verseKeys = Object.keys(scriptureMasteryVerses);
    } else {
      verseKeys = Object.keys(verses);
    }
  
    // Check if the game should end due to verse count limit
    if (usedVerses.length >= 25 && category === 'scripture-mastery') {
      endGame(score);
      return null;
    }
  
    let randomKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];
  
    // Ensure the selected verse hasn't been used before
    while (usedVerses.includes(randomKey)) {
      randomKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];
    }
  
    // Add the selected verse to usedVerses
    if (needNewVerse || countNewVerses === 2) {
      usedVerses.push(randomKey);
    }
  
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
    setSelectedVerse('');
    setSelectedChapter('');
    if (step == 'book') {
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

    const { chapterRange } = getDifficultySettings(difficulty);

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
        console.log(difficulty)
        const { multiplier, chapterRange, verseRange } = getDifficultySettings(difficulty);

        let accuracy = 0;
        let extraMultiplier = 20;

        if (verseDifference === 0) {
          accuracy += (100 * multiplier);
        }

        if (chapterDifference === 0) {
          accuracy += (50 * multiplier * (extraMultiplier + 5));
          console.log('Exact chapter!')
          console.log('50 * multiplier * (extraMultiplier + 5))')
          console.log('50 * ' + multiplier + ' * (' + extraMultiplier + ' + 5))')
          console.log(50 * multiplier * (extraMultiplier + 5))
          console.log('new accuracy: ' + accuracy)
          if (verseDifference === 0) {
            accuracy += (100 * multiplier * (extraMultiplier + 5));
            console.log('Exact chapter and verse! ENJOY MORE POINTS')
            console.log('100 * multiplier * (extraMultiplier + 5)')
            console.log('100 * ' + multiplier + ' * (' + extraMultiplier + ' + 5)')
            console.log(100 * multiplier * (extraMultiplier + 5))
            console.log('new accuracy: ' + accuracy)
          } else if (verseDifference <= verseRange) {
            accuracy += (20 * multiplier * (extraMultiplier - verseDifference))
            console.log('You had the exact chapter... but not the exact verse')
            console.log('20 * multiplier * (extraMultiplier - verseDifference)')
            console.log('20 * ' + multiplier + ' * (' + extraMultiplier + ' - ' + verseDifference + ')')
            console.log(20 * multiplier * (extraMultiplier - verseDifference))
            console.log('new accuracy: ' + accuracy)
          }
        } else if (chapterDifference <= chapterRange) {
          accuracy += (30 * multiplier * (extraMultiplier - chapterDifference));
          console.log('Within chapter range!')
          console.log('30 * multiplier * (extraMultiplier - chapterDifference)')
          console.log('30 * ' + multiplier + ' * (' + extraMultiplier + ' - ' + chapterDifference + ')')
          console.log(30 * multiplier * (extraMultiplier - chapterDifference))
          console.log('new accuracy: ' + accuracy)
          if (verseDifference <= verseRange) {
            accuracy += (15 * multiplier * (extraMultiplier - verseDifference));
            console.log('Which chapter range and verse range!')
            console.log('15 * multiplier * (extraMultiplier - verseDifference)')
            console.log('15 * ' + multiplier + ' * (' + extraMultiplier + ' - ' + verseDifference + ')')
            console.log(15 * multiplier * (extraMultiplier - verseDifference))
            console.log('new accuracy: ' + accuracy)
          }
        }

        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
        }
        bestAccuracy /= 10
      }
    });
    console.log('\n')
    return bestAccuracy;
  };

  const getDifficultySettings = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        if (!scriptureMasteryVerses) {
          console.log('Scripture Mastery Verses not loaded.');
        }
        return { multiplier: 1, chapterRange: 8, verseRange: 12 };
      case 'medium':
        return { multiplier: 8, chapterRange: 7, verseRange: 10 };
      case 'hard':
        return { multiplier: 12, chapterRange: 3, verseRange: 8 };
      default:
        console.log('Invalid difficulty level: ' + difficulty);
        return { multiplier: 1, chapterRange: 8, verseRange: 12 };
    }
  };

  const renderBooks = () => (
    <div className="selection-section">
      <div className='back-container'>
        <IconButton className="back-button" onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
      </div>
      <h3>Book</h3>
      {Object.keys(verseCounts).map((book) => (
        <Button variant="outlined" key={book} onClick={() => handleBookSelection(book)}>
          {book}
        </Button>
      ))}
      <div className="submit-button">
        <Button
          variant="contained"
          disabled={currentStep !== 'verse'} // Disable the button if currentStep is not 'verse'
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
        <div className='back-container'>
          <IconButton className="back-button" onClick={() => handleBack('book')}>
            <ArrowBack />
          </IconButton>
        </div>
        <h3>Chapter</h3>
        {chapters.map((chapter) => (
          <Button variant="outlined" key={chapter} onClick={() => handleChapterSelection(chapter)}>
            {chapter}
          </Button>
        ))}
        <div className="submit-button">
          <Button
            variant="contained"
            disabled={currentStep !== 'verse'} // Disable the button if currentStep is not 'verse'
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

    // Check if selectedVerse is not empty
    const isSubmitEnabled = currentStep === 'verse' && selectedVerse !== '';

    return (
      <div className="selection-section">
        <div className='back-container'>
          <IconButton className="back-button" onClick={() => handleBack('chapter')}>
            <ArrowBack />
          </IconButton>
        </div>
        <h3>Verse</h3>
        {verses.map((verse) => (
          <Button
            variant="outlined"
            key={verse}
            onClick={() => handleVerseSelection(verse)}
          >
            {verse}
          </Button>
        ))}
        <div className="submit-button">
          <Button
            variant="contained"
            disabled={!isSubmitEnabled} // Disable the button if isSubmitEnabled is false
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
          <p
            className='guess-text'>{selectedBook} {selectedChapter && (selectedVerse ? ` ${selectedChapter}:${selectedVerse}` : selectedChapter)}
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