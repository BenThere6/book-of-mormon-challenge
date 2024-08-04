import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Grid, IconButton, Snackbar, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import getDifficultySettings from '../assets/js/difficultySettings';
import '../assets/css/Settings.css';

const inappropriateWords = ['gay', 'sexual', 'inappropriate1', 'inappropriate2']; // Add more inappropriate words as needed

const customAdjectives = adjectives.filter(word => !inappropriateWords.includes(word));

const Settings = () => {
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [feedback, setFeedback] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedDifficulty = localStorage.getItem('gameDifficulty');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedDifficulty) {
      const capitalizedDifficulty = savedDifficulty.charAt(0).toUpperCase() + savedDifficulty.slice(1).toLowerCase();
      setDifficulty(capitalizedDifficulty);
    }
  }, []);

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
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      setOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleClose = (confirm) => {
    setOpen(false);
    if (confirm) {
      navigate('/');
    }
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

  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleCancel}>
            <ArrowBackIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, color: 'white' }}>
            Settings
          </Typography>
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

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button variant="outlined" onClick={saveSettings} sx={{ color: 'white', borderColor: 'white' }} disabled={!unsavedChanges}>
            Save Settings
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2, mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            How to Play
          </Typography>
          <Typography variant="body2" paragraph>
            The goal is to identify the book of the provided scripture, and be within the chapter range (see below). Points are awarded based on the proximity to the correct chapter and verse.
          </Typography>
          <Typography variant="body2" paragraph>
            Players have access to Liahonas and Skips as power-ups during the game. Each difficulty level grants 3 Liahonas and a varying number of Skips. Skips allow players to bypass a scripture without losing a life or earning points. Liahonas remove a percentage of incorrect options.
          </Typography>

          <Grid container spacing={2} className="grid-container">
            {/* Easy Difficulty */}
            <Grid item xs={12}>
              <Typography variant="h6">Easy</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Chapter Range</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('easy').chapterRange}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Verse Range</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('easy').verseRange}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Liahona Power</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('easy').removePercentage}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Skips</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('easy').skipCount}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Medium Difficulty */}
            <Grid item xs={12}>
              <Typography variant="h6">Medium</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Chapter Range</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('medium').chapterRange}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Verse Range</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('medium').verseRange}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Liahona Power</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('medium').removePercentage}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Skips</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('medium').skipCount}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Hard Difficulty */}
            <Grid item xs={12}>
              <Typography variant="h6">Hard</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Chapter Range</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('hard').chapterRange}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Verse Range</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('hard').verseRange}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Liahona Power</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('hard').removePercentage}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} className="grid-item">
              <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
                <CardContent>
                  <Typography variant="subtitle2" align="center">Skips</Typography>
                  <Typography variant="h4" align="center">{getDifficultySettings('hard').skipCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
          <Box sx={{ display: 'flex' }}>
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
            <Button onClick={() => handleClose(true)} sx={{ color: 'white' }} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message="Settings saved!"
          autoHideDuration={5000}
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
    </Box>
  );
};

export default Settings;