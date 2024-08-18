import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import socket from '../../assets/js/socket';

const MultiplayerLobby = ({ startMultiplayerGame }) => {
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Set up the socket event listener for when a game is created
    socket.on('gameCreated', (id) => {
      setSessionId(id);
    });

    // Clean up the event listener when the component is unmounted
    return () => {
      socket.off('gameCreated');
    };
  }, []);

  const createGame = () => {
    socket.emit('createGame');
  };

  const startGame = (difficulty, rounds) => {
    socket.emit('startGame', sessionId, difficulty, rounds);
    startMultiplayerGame(difficulty, rounds, sessionId);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create a Multiplayer Game
      </Typography>
      {sessionId ? (
        <Box>
          <Typography variant="h6">Game Code: {sessionId}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startGame('medium', 5)} // Adjust difficulty and rounds
          >
            Start Game
          </Button>
        </Box>
      ) : (
        <Button variant="contained" color="primary" onClick={createGame}>
          Create Game
        </Button>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default MultiplayerLobby;