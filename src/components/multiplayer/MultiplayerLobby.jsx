import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import socket from '../../assets/js/socket';

const MultiplayerLobby = ({ startMultiplayerGame }) => {
  const [sessionId, setSessionId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const createGame = () => {
    socket.emit('createGame');
    socket.on('gameCreated', (id) => {
      setSessionId(id);
    });
  };

  const joinGame = () => {
    socket.emit('joinGame', joinCode);
    socket.on('playerJoined', (players) => {
      setSessionId(joinCode);
      // Optionally, you can show the list of players who have joined the game
      console.log('Players:', players);
    });

    socket.on('error', (message) => {
      setError(message);
    });
  };

  const startGame = (rounds) => {
    socket.emit('startGame', sessionId, rounds);
    startMultiplayerGame(rounds, sessionId);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Multiplayer Lobby
      </Typography>
      {sessionId ? (
        <Box>
          <Typography variant="h6">Game Code: {sessionId}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startGame(5)} // Adjust the number of rounds if needed
          >
            Start Game
          </Button>
        </Box>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={createGame}>
            Create Game
          </Button>
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6">Join a Game</Typography>
            <TextField
              label="Enter Game Code"
              variant="outlined"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={joinGame}>
              Join Game
            </Button>
          </Box>
        </>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default MultiplayerLobby;