import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import UpdateModal from './UpdateModal';
import DevelopmentModal from './DevelopmentModal';
import UPDATES from '../assets/js/updates';
import getDifficultySettings from '../assets/js/difficultySettings';
import { useTheme } from '@mui/material';

const DEVELOPMENT_MESSAGE = 'This application is currently under development. You might encounter bugs, design flaws, or areas that could be improved. If you notice any issues or have suggestions for enhancements, please submit it in feedback.';

const specialUsername = "Caleb"; // Replace with your desired username
const specialMessageId = "Note-1"; // Unique ID for the message
const specialMessage = `Thank you for your feedback! I like the ideas of adding a practice mode and a timer powerup, I'll work on adding those to the game soon.

Regarding your concern about the game automatically moving to the next question when time runs out, the game does show a modal with the correct answer, and it submits whatever you’ve selected up to that point. The modal can be closed either by clicking "Next" or by clicking outside of it. Because of your feedback, I’ve now implemented a 3-second timer that prevents the modal from being closed until the timer has finished. If you continue to experience any issues with this, please let me know, and I’ll look into it further.

Once again, thank you for your valuable feedback. It’s incredibly helpful as I continue to improve the game!

Best Regards, 
Ben`;

function StartScreen({ startGame }) {
  const theme = useTheme();
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatesToShow, setUpdatesToShow] = useState([]);
  const [isNoUsernameModalOpen, setIsNoUsernameModalOpen] = useState(false);
  const [isSpecialUserModalOpen, setIsSpecialUserModalOpen] = useState(false);
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem('username');
  const storedDifficulty = localStorage.getItem('gameDifficulty') || 'medium';
  const storedSeenUpdates = JSON.parse(localStorage.getItem('seenUpdates')) || [];
  const storedDevelopmentNotice = localStorage.getItem('developmentNotice');
  const previouslyVisited = localStorage.getItem('previouslyVisited');

  const currentVersion = UPDATES[UPDATES.length - 1].version;

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleFeedbackClick = () => {
    navigate('/settings', { state: { openFeedback: true } });
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
    const checkForUpdates = () => {
      if (!previouslyVisited) {
        localStorage.setItem('previouslyVisited', 'true');
        localStorage.setItem('seenUpdates', JSON.stringify(UPDATES.map(update => update.version)));
      } else {
        const updates = accumulateUpdates(storedSeenUpdates);
        if (updates.length > 0) {
          setUpdatesToShow(updates);
          setIsUpdateModalOpen(true);
        }
      }

      if (!storedDevelopmentNotice) {
        setShowDevelopmentModal(true);
      }

      const hasSeenSpecialUserModal = JSON.parse(localStorage.getItem('seenSpecialUserMessages')) || [];

      if (storedUsername === specialUsername && !hasSeenSpecialUserModal.includes(specialMessageId)) {
        setIsSpecialUserModalOpen(true);
      }
    };

    checkForUpdates();

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

    setTimeout(() => {
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
    }, 0); // No delay
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { state: { fromStartScreen: true } });
  };

  const handleAdmin = () => {
    navigate('/admin');
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

  const handleSpecialUserModalClose = async () => {
    setIsSpecialUserModalOpen(false);
  
    const seenSpecialUserMessages = JSON.parse(localStorage.getItem('seenSpecialUserMessages')) || [];
    seenSpecialUserMessages.push(specialMessageId);
    localStorage.setItem('seenSpecialUserMessages', JSON.stringify(seenSpecialUserMessages));
  
    // Send a notification to the backend
    try {
      await fetch('https://bens-api-dd63362f50db.herokuapp.com/leaderboard/special-message-seen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: specialUsername }),
      });
      console.log('Notification sent to backend');
    } catch (error) {
      console.error('Failed to send notification to backend:', error);
    }
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}>
        <Button variant="outlined" onClick={handleAdmin}>Admin</Button>
      </Box>
      <Container
        id='start-content-container'
        sx={{
          textAlign: 'center',
          padding: 4,
          borderRadius: 2,
          mt: 'auto',
          mb: 0,
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexGrow: 1,
        }}>
        <Button variant="contained" onClick={handleStart} sx={{
          width: '100%',
          mb: 1,
          [theme.breakpoints.down('md')]: {
            '&:hover': {
              color: 'white',
              borderColor: 'white',
            },
          },
        }}>
          Start Game
        </Button>
        <Grid container spacing={1} sx={{ width: '100%' }}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={handleViewLeaderboard}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                }
              }}
            >
              Leaderboard
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={handleViewHistory}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                }
              }}
            >
              History
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={handleSettingsClick}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                }
              }}
            >
              Settings
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={handleFeedbackClick}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                width: '100%',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                }
              }}
            >
              Feedback
            </Button>
          </Grid>
        </Grid>
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
      <Dialog
        open={isSpecialUserModalOpen}
        onClose={handleSpecialUserModalClose}
        aria-labelledby="special-user-dialog-title"
        aria-describedby="special-user-dialog-description"
      >
        <DialogTitle id="special-user-dialog-title">{`Note to ${specialUsername}`}</DialogTitle>
        <DialogContent>
          {specialMessage.split('\n').map((line, index) => (
            <DialogContentText key={index} sx={{ mb: 1 }}>
              {line}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSpecialUserModalClose} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StartScreen;