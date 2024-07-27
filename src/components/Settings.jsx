import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [feedback, setFeedback] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedDifficulty = localStorage.getItem('gameDifficulty');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedDifficulty) {
      // Capitalize the first letter to match the dropdown options
      const capitalizedDifficulty = savedDifficulty.charAt(0).toUpperCase() + savedDifficulty.slice(1).toLowerCase();
      setDifficulty(capitalizedDifficulty);
    }
  }, []);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Save settings to local storage or backend
    localStorage.setItem('username', username);
    localStorage.setItem('gameDifficulty', difficulty.toLowerCase());
    alert('Settings saved!');
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

  const submitFeedback = () => {
    // Submit feedback to the backend or email
    alert('Feedback submitted!');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mb: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <TextField
            label="Username"
            onChange={handleChange(setUsername)}
            variant="outlined"
            {...(username && { placeholder: username })}
          />
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Gameplay
        </Typography>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            onChange={handleChange(setDifficulty)}
            label="Difficulty"
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button variant="contained" color="primary" onClick={saveSettings}>
          Save Settings
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          How to Play
        </Typography>
        <Typography variant="body2" paragraph>
          The goal is to identify the reference (book, chapter, and verse) of the provided scripture. To avoid losing a life, the user must guess the correct book and be within the specified chapter range. Points are awarded based on the proximity to the correct chapter and verse.
        </Typography>
        <Typography variant="body2" paragraph>
          Players have access to Liahonas and Skips as power-ups during the game. Each difficulty level grants 3 Liahonas and a varying number of Skips. Skips allow players to bypass a scripture without losing a life or earning points. Liahonas remove a percentage of incorrect options.
        </Typography>

        <Grid container spacing={2}>
          {/* Easy Difficulty */}
          <Grid item xs={12}>
            <Typography variant="h6">Easy</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Chapter Range</Typography>
                <Typography variant="h4" align="center">15</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Verse Range</Typography>
                <Typography variant="h4" align="center">20</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Liahona Power</Typography>
                <Typography variant="h4" align="center">70%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Skips</Typography>
                <Typography variant="h4" align="center">3</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Medium Difficulty */}
          <Grid item xs={12}>
            <Typography variant="h6">Medium</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Chapter Range</Typography>
                <Typography variant="h4" align="center">7</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Verse Range</Typography>
                <Typography variant="h4" align="center">10</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Liahona Power</Typography>
                <Typography variant="h4" align="center">60%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Skips</Typography>
                <Typography variant="h4" align="center">2</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Hard Difficulty */}
          <Grid item xs={12}>
            <Typography variant="h6">Hard</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#e0f7fa' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Chapter Range</Typography>
                <Typography variant="h4" align="center">3</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#ffecb3' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Verse Range</Typography>
                <Typography variant="h4" align="center">8</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#c8e6c9' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Liahona Power</Typography>
                <Typography variant="h4" align="center">60%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#ffccbc' }}>
              <CardContent>
                <Typography variant="subtitle2" align="center">Skips</Typography>
                <Typography variant="h4" align="center">1</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Feedback
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            value={feedback}
            onChange={handleChange(setFeedback)}
            variant="outlined"
            placeholder="Enter your feedback here"
          />
        </FormControl>
        <Button sx={{ mb: 4 }} variant="contained" color="primary" onClick={submitFeedback}>
          Submit Feedback
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have unsaved changes. Are you sure you want to leave without saving?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleClose(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;