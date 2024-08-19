import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import socket from '../../assets/js/socket';

const InGame = ({ sessionId }) => {
  const [timer, setTimer] = useState(0);
  const [guess, setGuess] = useState('');
  const [scores, setScores] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);  // Default to 1
  const [verse, setVerse] = useState('');  // State for the verse
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('gameStarted', ({ rounds, players = [] }) => {
      setScores(players.map(player => ({ playerName: player.id, points: 0 })));
    });

    socket.on('roundStarted', ({ currentRound, verse, duration, players = [] }) => {
      console.log('Round started:', currentRound, 'Verse:', verse, 'Duration:', duration); // Debugging log
      setVerse(verse || '');  // Set the verse or an empty string if undefined
      setTimer(duration || 60);  // Use the duration sent by the backend, default to 60 if undefined
      setCurrentRound(currentRound || 1);  // Set the current round, default to 1
      setScores(players.map(player => ({ playerName: player.id, points: 0 })));

      // Start the countdown timer
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup on component unmount
    });

    socket.on('guessSubmitted', ({ playerId, guess, points }) => {
      setScores(prevScores => {
        return prevScores.map(score => {
          if (score.playerName === playerId) {
            return { ...score, points: score.points + points };
          }
          return score;
        });
      });
    });

    socket.on('roundEnded', (currentRound, players = []) => {
      setScores(players.map(player => ({ playerName: player.id, points: player.score })));
      setCurrentRound(currentRound);
      if (currentRound > rounds) {
        navigate('/multiplayer/results', { state: { scores: players } });
      }
    });

    return () => {
      socket.off('gameStarted');
      socket.off('roundStarted');
      socket.off('guessSubmitted');
      socket.off('roundEnded');
    };
  }, [navigate]);

  const submitGuess = () => {
    if (guess !== '') {
      socket.emit('submitGuess', sessionId, guess);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Round {currentRound}  {/* Render the round number */}
      </Typography>
      <Typography variant="h6">Time Remaining: {timer} seconds</Typography>
      <Typography variant="h5" gutterBottom>
        {verse ? verse : 'Loading verse...'}  {/* Display the verse */}
      </Typography>
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