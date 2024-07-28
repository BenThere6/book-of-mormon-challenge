import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UpdateModal from './UpdateModal';
import DevelopmentModal from './DevelopmentModal';
import '../assets/css/StartScreen.css';
import UPDATES from '../assets/js/updates';
import getDifficultySettings from '../assets/js/difficultySettings';

const DEVELOPMENT_MESSAGE = 'This application is currently under development. You might encounter bugs, design flaws, or areas that could be improved. If you notice any issues or have suggestions for enhancements, please click the feedback button at the bottom of the settings page to share your thoughts.';

function StartScreen({ startGame }) {
  const [secretCodeIndex, setSecretCodeIndex] = useState(0);
  const [firstClickTime, setFirstClickTime] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatesToShow, setUpdatesToShow] = useState([]);
  const [isNoUsernameModalOpen, setIsNoUsernameModalOpen] = useState(false);
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem('username');
  const storedDifficulty = localStorage.getItem('gameDifficulty') || 'medium';
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

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleStart = () => {
    if (!storedUsername) {
      setIsNoUsernameModalOpen(true);
      return;
    }

    const difficultySettings = getDifficultySettings(storedDifficulty);
    localStorage.setItem('gameScore', 0);
    localStorage.setItem('gameLives', 3);
    localStorage.setItem('gameDifficulty', storedDifficulty);
    localStorage.setItem('gameBombs', difficultySettings?.bombCount || 3);
    localStorage.setItem('gameSkips', difficultySettings?.skipCount || 3);
    localStorage.setItem('gameCurrentVerse', '');

    let gameIDs = JSON.parse(localStorage.getItem('gameIDs')) || {};
    const newGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) + 1 : 1;
    gameIDs[newGameID] = false;

    localStorage.setItem('gameIDs', JSON.stringify(gameIDs));
    localStorage.setItem('currentGameID', newGameID);

    const category = 'all-verses';

    startGame(newGameID, storedDifficulty, category);
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { state: { fromStartScreen: true } });
  };

  const handleNoUsernameModalClose = () => {
    setIsNoUsernameModalOpen(false);
    navigate('/settings');
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    const seenUpdates = updatesToShow.map((update) => update.version);
    const updatedSeenUpdates = [...storedSeenUpdates, ...seenUpdates];
    localStorage.setItem('seenUpdates', JSON.stringify(updatedSeenUpdates));
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

  return (
    <div className='centered-element'>
      <div className="start-screen">
        <div className='top-row'>
          <Button variant="text" onClick={handleViewLeaderboard}>Leaderboard</Button>
          <Button variant="text" onClick={handleViewHistory}>History</Button>
          <IconButton onClick={handleSettingsClick}>
            <SettingsIcon />
          </IconButton>
        </div>
        <div className="image-container">
          <img id="title" src="/title.png" alt="Lehi's Legacy" />
        </div>
        <div className="start-button-container">
          <Button variant="contained" onClick={handleStart}>Start Game</Button>
        </div>
      </div>
      <DevelopmentModal
        open={showDevelopmentModal}
        onClose={handleDevelopmentModalClose}
        developmentMessage={DEVELOPMENT_MESSAGE}
      />
      <UpdateModal open={isUpdateModalOpen} onClose={handleUpdateModalClose} updates={updatesToShow} />
      <Dialog
        open={isNoUsernameModalOpen}
        onClose={handleNoUsernameModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Set Your Username"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You need to set your username first.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoUsernameModalClose} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StartScreen;