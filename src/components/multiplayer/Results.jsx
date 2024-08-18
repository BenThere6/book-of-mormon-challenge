import React, { useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../../assets/js/socket';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scores } = location.state || { scores: [] };

  // Sort scores to determine the winner
  const sortedScores = scores.sort((a, b) => b.points - a.points);
  const winner = sortedScores[0];

  const handleBackToLobby = () => {
    navigate('/multiplayer/lobby');
  };

  useEffect(() => {
    // Cleanup socket listeners related to the game when leaving the results screen
    return () => {
      socket.off('gameEnded'); // Ensure that no unnecessary event listeners are left
    };
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Game Results
      </Typography>
      {winner && (
        <Typography variant="h5" color="primary" gutterBottom>
          Winner: {winner.playerName} with {winner.points} points!
        </Typography>
      )}
      <Box sx={{ marginTop: 2 }}>
        {sortedScores.map((score, index) => (
          <Typography key={index} variant="h6">
            {index + 1}. {score.playerName}: {score.points} points
          </Typography>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToLobby}
        sx={{ marginTop: 4 }}
      >
        Back to Lobby
      </Button>
    </Box>
  );
};

export default Results;