import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [feedback, setFeedback] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setUnsavedChanges(true);
  };

  const submitFeedback = () => {
    
  }

  const saveSettings = () => {
    // Save settings to local storage or backend
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Username"
            value={username}
            onChange={handleChange(setUsername)}
            variant="outlined"
          />
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Gameplay
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
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

        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Difficulty Levels:
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Easy:</strong> Multiple choice questions. Select the correct verse reference from a list of options.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Medium:</strong> Fill in the blank. Complete the verse by typing in the missing words.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Hard:</strong> Identify the verse. Type the correct reference for a given verse.
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button variant="contained" color="primary" onClick={saveSettings}>
          Save Settings
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
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
        <Button variant="contained" color="primary" onClick={submitFeedback}>
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