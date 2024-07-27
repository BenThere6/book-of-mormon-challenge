import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import UsernameEntry from './Username';
import UpdateModal from './UpdateModal';
import DevelopmentModal from './DevelopmentModal';
import '../assets/css/StartScreen.css';
import UPDATES from '../assets/js/updates';
import getDifficultySettings from '../assets/js/difficultySettings';

const DEVELOPMENT_MESSAGE = 'This application is currently under development. You might encounter bugs, design flaws, or areas that could be improved. If you notice any issues or have suggestions for enhancements, please click the feedback button in the bottom left corner of the start screen to share your thoughts.';
const SECRET_CODE = ['easy', 'hard', 'hard', 'easy', 'medium', 'medium', 'easy', 'hard'];
const SECRET_CODE_TIME_LIMIT = 10000; // 10 seconds

function StartScreen({ startGame }) {
  localStorage.removeItem('difficulty')
  const [secretCodeIndex, setSecretCodeIndex] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatesToShow, setUpdatesToShow] = useState([]);
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem('username');
  const storedSeenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
  const storedDevelopmentNotice = localStorage.getItem('developmentNotice');

  const handleFeedbackClick = () => {
    navigate('/feedback', { state: { username: storedUsername } });
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const accumulateUpdates = (seenUpdates) => {
    let updatesToShow = [];

    for (let update of UPDATES) {
      if (!seenUpdates.includes(update.version)) {
        updatesToShow.push(update);
      }
    }

    return updatesToShow;
  };

  useEffect(() => {
    const updates = accumulateUpdates(storedSeenUpdates);
    if (updates.length > 0) {
      setUpdatesToShow(updates);
      setIsUpdateModalOpen(true);
    }
    if (!storedDevelopmentNotice) {
      setShowDevelopmentModal(true);
    }
  }, []);

  const handleDevelopmentModalClose = () => {
    setShowDevelopmentModal(false);
    localStorage.setItem('developmentNotice', 'shown');
  };

  const handleUsernameClick = () => {
    setShowUsernameModal(true);
  };

  const handleUsernameChange = (newUsername) => {
    if (newUsername) {
      localStorage.setItem('username', newUsername);
      setShowUsernameModal(false);
    }
  };

  const handleStart = () => {
    localStorage.setItem('gameScore', 0);
    localStorage.setItem('gameLives', 3);
    const difficultySettings = getDifficultySettings(difficulty);
    localStorage.setItem('gameBombs', difficultySettings?.bombCount || 3);
    localStorage.setItem('gameCurrentVerse', '');

    let gameIDs = JSON.parse(localStorage.getItem('gameIDs')) || {};
    const newGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) + 1 : 1;
    gameIDs[newGameID] = false;

    localStorage.setItem('gameIDs', JSON.stringify(gameIDs));
    localStorage.setItem('currentGameID', newGameID);

    const category = 'all-verses';

    if (storedUsername) {
      startGame(newGameID, difficulty, category);
    } else {
      setShowUsernameModal(true);
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { state: { fromStartScreen: true } });
  };

  const handleDifficultyClick = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);

    const currentTime = new Date().getTime();

    if (firstClickTime && currentTime - firstClickTime > SECRET_CODE_TIME_LIMIT) {
      setSecretCodeIndex(0);
      setFirstClickTime(null);
    }

    if (selectedDifficulty === SECRET_CODE[secretCodeIndex]) {
      if (secretCodeIndex === 0) {
        setFirstClickTime(currentTime);
      }

      const nextIndex = secretCodeIndex + 1;
      setSecretCodeIndex(nextIndex);

      if (nextIndex === SECRET_CODE.length) {
        navigate('/admin');
        setSecretCodeIndex(0);
        setFirstClickTime(null);
      }
    } else {
      setSecretCodeIndex(0);
      setFirstClickTime(null);
    }
  };

  const getDifficultyDescription = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return ['Only scripture mastery verses', '15', '1x', '4'];
      case 'medium':
        return ['Any Book of Mormon verse', '7', '8x', '3'];
      case 'hard':
        return ['Any Book of Mormon verse', '3', '12x', '2'];
      default:
        return [''];
    }
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    const seenUpdates = updatesToShow.map((update) => update.version);
    const updatedSeenUpdates = [...storedSeenUpdates, ...seenUpdates];
    localStorage.setItem('seenUpdates', JSON.stringify(updatedSeenUpdates));
  };

  return (
    <div className='centered-element'>
      <div className="start-screen">
        <div className='top-row'>
          <div className="username-button">
            <Button variant="text" onClick={handleUsernameClick}>
              {storedUsername ? `${storedUsername}` : 'Set Username'}
            </Button>
            {showUsernameModal && (
              <UsernameEntry setUsername={handleUsernameChange} startGame={startGame} onClose={() => setShowUsernameModal(false)} />
            )}
          </div>
          <Button variant="text" onClick={handleViewLeaderboard}>Leaderboard</Button>
        </div>
        <div className="image-container">
          <img id="title" src="/title.png" alt="Lehi's Legacy" />
        </div>
        <div className="button-group">
          <ButtonGroup variant="contained">
            <Button
              onClick={() => handleDifficultyClick('easy')}
              color={difficulty === 'easy' ? 'primary' : 'inherit'}
            >
              Easy
            </Button>
            <Button
              onClick={() => handleDifficultyClick('medium')}
              color={difficulty === 'medium' ? 'primary' : 'inherit'}
            >
              Medium
            </Button>
            <Button
              onClick={() => handleDifficultyClick('hard')}
              color={difficulty === 'hard' ? 'primary' : 'inherit'}
            >
              Hard
            </Button>
          </ButtonGroup>
        </div>
        <div className='difficulty-details-container'>
          <div>
            {difficulty && <p className='detail-title'>Chapter Margin</p>}
            <p>{getDifficultyDescription(difficulty)[1]}</p>
          </div>
          {/* <div>
            {difficulty && <p className='detail-title'>Points Multiplier</p>}
            <p>{getDifficultyDescription(difficulty)[2]}</p>
          </div> */}
          {/* <div>
            {difficulty && <p className='detail-title'>Liahonas</p>}
            <p>{getDifficultyDescription(difficulty)[3]}</p>
          </div> */}
        </div>
        <div className="start-button-container">
          <Button variant="contained" onClick={handleStart} disabled={!difficulty}>Start Game</Button>
        </div>
        <Button id='feedback-button' variant="text" onClick={handleFeedbackClick}>Feedback</Button>
        <Button id='history-button' variant="text" onClick={handleViewHistory}>History</Button>
      </div>
      <DevelopmentModal
        open={showDevelopmentModal}
        onClose={handleDevelopmentModalClose}
        developmentMessage={DEVELOPMENT_MESSAGE}
      />
      <UpdateModal open={isUpdateModalOpen} onClose={handleUpdateModalClose} updates={updatesToShow} />
    </div>
  );
}

export default StartScreen;