import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import socket from '../../assets/js/socket';

const InGame = ({ sessionId }) => {
  const [timer, setTimer] = useState(30);
  const [guess, setGuess] = useState('');
  const [scores, setScores] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('gameStarted', ({ roundTime, players }) => {
      setTimer(roundTime);
      // Set up other initial states if necessary
    });

    socket.on('guessSubmitted', (playerId, playerGuess) => {
      // Handle submitted guess
    });

    socket.on('roundEnded', (roundResults) => {
      setScores(roundResults.scores);
      setCurrentRound(roundResults.currentRound);
      if (roundResults.currentRound > roundResults.totalRounds) {
        navigate('/multiplayer/results', { state: { scores: roundResults.scores } });
      }
    });

    return () => {
      socket.off('gameStarted');
      socket.off('guessSubmitted');
      socket.off('roundEnded');
    };
  }, [navigate]);

  const submitGuess = () => {
    socket.emit('submitGuess', sessionId, guess);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Round {currentRound}
      </Typography>
      <Typography variant="h6">Time Remaining: {timer} seconds</Typography>
      <TextField
        label="Your Guess"
        variant="outlined"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={submitGuess}>
        Submit Guess
      </Button>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5">Scores:</Typography>
        {scores.map((score, index) => (
          <Typography key={index}>
            {score.playerName}: {score.points} points
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default InGame;