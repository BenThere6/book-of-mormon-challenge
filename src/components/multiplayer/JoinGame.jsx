import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const serverUrl =
  import.meta.env.VITE_NODE_ENV === 'dev'
    ? 'http://localhost:3000'
    : 'https://bens-api-dd63362f50db.herokuapp.com';

const socket = io(serverUrl);

const JoinGame = () => {
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const joinGame = () => {
    socket.emit('joinGame', sessionId);
    socket.on('playerJoined', (players) => {
      console.log('Players:', players);
      navigate('/multiplayer/game', { state: { sessionId } });
    });

    socket.on('error', (message) => {
      setError(message);
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Join a Multiplayer Game
      </Typography>
      <TextField
        label="Game Code"
        variant="outlined"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={joinGame}>
        Join Game
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default JoinGame;