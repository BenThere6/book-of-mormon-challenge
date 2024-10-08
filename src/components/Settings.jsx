import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Grid, IconButton, Snackbar, Slide } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import getDifficultySettings from '../assets/js/difficultySettings';
import '../assets/css/Settings.css';

const inappropriateWords = ['gay', 'sexual', 'inappropriate1', 'inappropriate2']; // Add more inappropriate words as needed

const customAdjectives = adjectives.filter(word => !inappropriateWords.includes(word));

const Settings = ({ startGame }) => {
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [feedback, setFeedback] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);
  const [isUsernameSaved, setIsUsernameSaved] = useState(false); // New state to track if username is saved

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedDifficulty = localStorage.getItem('gameDifficulty');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsUsernameSaved(true); // Set to true if username exists
    }
    if (savedDifficulty) {
      const capitalizedDifficulty = savedDifficulty.charAt(0).toUpperCase() + savedDifficulty.slice(1).toLowerCase();
      setDifficulty(capitalizedDifficulty);
    }
  }, []);

  useEffect(() => {
    // Check if the state is passed from the navigate function
    if (location.state?.openFeedback) {
      // Automatically focus on the feedback section or do whatever is needed
      document.getElementById('submit-feedback-container').scrollIntoView();
    }
  }, [location.state]);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('gameDifficulty', difficulty.toLowerCase());
    setTransition(() => TransitionDown);
    setSnackbarOpen(true);
    setUnsavedChanges(false);
    setIsUsernameSaved(true); // Update to true when settings are saved
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      saveSettings(); // Save any unsaved changes
    }
    navigate('/'); // Navigate back to the home page
  };

  const handleClose = (confirm, callback = null) => {
    setOpen(false);
    if (confirm) {
      if (callback) {
        callback();
      } else {
        navigate('/');
      }
    }
  };

  const handleSettingsStartGame = () => {
    if (unsavedChanges) {
      saveSettings(); // Save any unsaved changes
    }
    startGameProcess(); // Proceed to start the game
  };

  const startGameProcess = () => {
    if (!username) {
        alert('Please set your username first.');
        return;
    }

    setTimeout(() => {
        const difficultySettings = getDifficultySettings(difficulty.toLowerCase());

        // Initialize game settings
        localStorage.setItem('gameScore', 0);
        localStorage.setItem('gameLives', 3);
        localStorage.setItem('gameDifficulty', difficulty.toLowerCase());
        localStorage.setItem('gameBombs', difficultySettings?.bombCount || 3);
        localStorage.setItem('gameSkips', difficultySettings?.skipCount || 3);
        
        // Initialize the current verse
        localStorage.setItem('gameCurrentVerse', ''); // Initialize with empty string or set with logic if needed

        // Assign a new Game ID
        let gameIDs = JSON.parse(localStorage.getItem('gameIDs')) || {};
        const newGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) + 1 : 1;
        gameIDs[newGameID] = false;

        localStorage.setItem('gameIDs', JSON.stringify(gameIDs));
        localStorage.setItem('currentGameID', newGameID);

        const category = 'all-verses';

        // Navigate to game page with proper state
        startGame(newGameID, difficulty.toLowerCase(), category);
    }, 0); // No delay
};

  const submitFeedback = async () => {
    if (!username) {
      alert('Please set your username first.');
      return;
    }

    try {
      const response = await fetch('https://bens-api-dd63362f50db.herokuapp.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, feedback }),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setFeedback('');
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred. Please try again.');
    }
    setUnsavedChanges(false);
  };

  const generateUsername = () => {
    const randomUsername = uniqueNamesGenerator({
      dictionaries: [customAdjectives, animals],
      separator: '',
      style: 'capital',
    });
    setUsername(randomUsername);
    setUnsavedChanges(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  // Function to dynamically render the difficulty tiles
  const renderDifficultyTiles = () => {
    const settings = getDifficultySettings(difficulty.toLowerCase());

    return (
      <Grid container spacing={2} className="grid-container">
        <Grid item xs={12}>
          <Typography id='how-to-diff' variant="h6">{difficulty}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item">
          <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
            <CardContent>
              <Typography variant="subtitle2" align="center">Chapter Range</Typography>
              <Typography variant="h4" align="center">{settings.chapterRange}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item">
          <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
            <CardContent>
              <Typography variant="subtitle2" align="center">Timer (seconds)</Typography>
              <Typography variant="h4" align="center">{settings.timer}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item">
          <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
            <CardContent>
              <Typography variant="subtitle2" align="center">Liahona Power</Typography>
              <Typography variant="h4" align="center">{settings.removePercentage}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item">
          <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
            <CardContent>
              <Typography variant="subtitle2" align="center">Skips</Typography>
              <Typography variant="h4" align="center">{settings.skipCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'EB Garamond, serif',
        fontSize: '20px',
        boxSizing: 'border-box'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('/background-images/settings-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          filter: 'brightness(0.7)', // To make the image more subtle
        }}
      />
      <Box
        id='settings-container'
        sx={{
          p: 4,
          maxWidth: 600,
          mx: 'auto',
          mb: 0,
          pb: 0,
          zIndex: 1,
          overflowY: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 2,
          minHeight: '100vh',
          pt: 8, // Add padding top to avoid cutting off the top content
          boxSizing: 'border-box'
        }}
      >
        <Box id='settings-header' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleCancel}>
            <ArrowBackIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, color: 'white' }}>
            Settings
          </Typography>
          <Button
            id='save-button'
            variant="outlined"
            onClick={saveSettings}
            sx={{
              color: 'black',
              borderColor: 'black',
              '&.Mui-disabled': {
                color: 'black',
                borderColor: 'black',
              },
            }}
            disabled={!unsavedChanges}
          >
            Save
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Account
          </Typography>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <TextField
              label="Username"
              onChange={handleChange(setUsername)}
              variant="outlined"
              value={username}
              InputLabelProps={{ shrink: true, style: { color: 'white' } }}
              InputProps={{
                style: {
                  color: 'white',
                },
              }}
              sx={{ '.MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
            />
          </FormControl>
          <Box sx={{ display: 'flex', mt: 1 }}>
            <Button variant="outlined" onClick={generateUsername} sx={{ color: 'white', borderColor: 'white' }}>
              Generate Username
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Gameplay
          </Typography>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel sx={{ color: 'white' }}>Difficulty</InputLabel>
            <Select
              value={difficulty}
              onChange={handleChange(setDifficulty)}
              label="Difficulty"
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
          {/* Render the dynamic tiles based on selected difficulty */}
          {renderDifficultyTiles()}

          <Typography id='how-to-play-title' variant="h6" gutterBottom>
            How to Play
          </Typography>
          <Typography variant="body2" paragraph>
            The goal is to identify the book of the provided scripture, and be within the chapter range (see tile above). Points are awarded based on the proximity to the correct chapter and verse.
          </Typography>
          <Typography id='how-to-p-2' variant="body2" paragraph>
            Players have access to Liahonas and Skips as power-ups during the game. Each difficulty level grants 3 Liahonas and a varying number of Skips. Skips allow players to bypass a scripture without losing a life or earning points. Liahonas remove a percentage of incorrect options.
          </Typography>
        </Paper>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Feedback
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              multiline
              rows={4}
              value={feedback}
              onChange={handleChange(setFeedback)}
              variant="outlined"
              placeholder="Enter your feedback here"
              InputLabelProps={{ shrink: true, style: { color: 'white' } }}
              InputProps={{
                style: {
                  color: 'white',
                },
              }}
              sx={{ '.MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
            />
          </FormControl>
          <Box id='submit-feedback-container' sx={{ display: 'flex' }}>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} onClick={submitFeedback}>
              Submit Feedback
            </Button>
          </Box>
        </Box>

        <Dialog
          open={open}
          onClose={() => handleClose(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              border: '1px solid white', // Add white border
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ color: 'white' }}>Unsaved Changes</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ color: 'white' }}>
              You have unsaved changes. Are you sure you want to leave without saving?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(false)} sx={{ color: 'white' }}>
              No
            </Button>
            <Button onClick={() => handleClose(true, startGameProcess)} sx={{ color: 'white' }} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          id='snack-bar'
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message="Settings saved!"
          autoHideDuration={2200}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionComponent={transition}
          ContentProps={{
            sx: {
              backgroundColor: 'green',
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      {/* Conditionally render the Start Game button */}
      {/* {isUsernameSaved && ( */}
        <Box
          id='settings-start-game-container'
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 2,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSettingsStartGame}
            sx={{ width: '50%', maxWidth: 400, fontSize: '1.2rem' }}
          >
            START GAME
          </Button>
        </Box>
      {/* )} */}
    </Box>
  );
};

export default Settings;