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
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import UpdateModal from './UpdateModal';
import DevelopmentModal from './DevelopmentModal';
import UPDATES from '../assets/js/updates';
import getDifficultySettings from '../assets/js/difficultySettings';

const DEVELOPMENT_MESSAGE = 'This application is currently under development. You might encounter bugs, design flaws, or areas that could be improved. If you notice any issues or have suggestions for enhancements, please click the feedback button at the bottom of the settings page to share your thoughts.';

function StartScreen({ startGame }) {
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatesToShow, setUpdatesToShow] = useState([]);
  const [isNoUsernameModalOpen, setIsNoUsernameModalOpen] = useState(false);
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem('username');
  const storedDifficulty = localStorage.getItem('gameDifficulty') || 'medium';
  const storedSeenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
  const storedDevelopmentNotice = localStorage.getItem('developmentNotice');

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

  const handleAdmin = () => {
    navigate('/admin')
  }

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundImage: `url('/title-image.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}>
        <Button variant="outlined" onClick={handleAdmin}>Admin</Button>
      </Box>
      <Container sx={{
        textAlign: 'center',
        // backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 4,
        borderRadius: 2,
        mt: '25vh',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '75vh'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: .5
        }}>
          <Button variant="contained" onClick={handleStart} sx={{ mt: 4 }}>Start Game</Button>
          <Button
            variant="outlined"
            onClick={handleViewLeaderboard}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            Leaderboard
          </Button>
          <Button
            variant="outlined"
            onClick={handleViewHistory}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            History
          </Button>
          <Button
            variant="outlined"
            onClick={handleSettingsClick}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            Settings
          </Button>
        </Box>
      </Container>
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
    </Box>
  );
}

export default StartScreen;