import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import socket from '../../assets/js/socket';

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

  useEffect(() => {
    // Cleanup socket listeners when the component is unmounted
    return () => {
      socket.off('playerJoined');
      socket.off('error');
    };
  }, []);

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