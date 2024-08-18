import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { io } from 'socket.io-client';

const serverUrl =
  import.meta.env.VITE_NODE_ENV === 'dev'
    ? 'http://localhost:3000'
    : 'https://bens-api-dd63362f50db.herokuapp.com';

const socket = io(serverUrl);

const MultiplayerLobby = ({ startMultiplayerGame }) => {
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');

  const createGame = () => {
    socket.emit('createGame');
    socket.on('gameCreated', (id) => {
      setSessionId(id);
    });
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