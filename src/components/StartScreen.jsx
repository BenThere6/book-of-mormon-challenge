import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import UsernameEntry from './Username'; // Import Username component
import '../assets/css/StartScreen.css';

function StartScreen({ startGame }) {
  const [difficulty, setDifficulty] = useState(''); // Default to empty string
  const [showUsernameModal, setShowUsernameModal] = useState(false); // State for showing Username modal
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem('username');

  const handleUsernameClick = () => {
    setShowUsernameModal(true); // Show Username modal
  };

  const handleUsernameChange = (newUsername) => {
    if (newUsername) {
      localStorage.setItem('username', newUsername);
      setShowUsernameModal(false); // Hide Username modal after username is set
    }
  };

  const handleStart = () => {
    localStorage.setItem('gameScore', 0);
    localStorage.setItem('gameLives', 3);

    // Generate game ID object if it doesn't exist in localStorage
    let gameIDs = JSON.parse(localStorage.getItem('gameIDs')) || {};
    const newGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) + 1 : 1;
    gameIDs[newGameID] = false; // Initialize new game ID with false

    localStorage.setItem('gameIDs', JSON.stringify(gameIDs));

    if (storedUsername) {
      startGame(newGameID, difficulty); // Pass gameID and difficulty to startGame function
    } else {
      setShowUsernameModal(true); // Show Username modal if username is not set
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard', { state: { fromStartScreen: true } });
  };

  const getDifficultyDescription = () => {
    switch (difficulty) {
      case 'easy':
        return [
          'Practice scripture mastery verses!',
          'Get within 8 chapters',
          '1x multiplier',
          'Extra points for exact chapter or verse!',
          '(If not within chapter range you',
          'lose a life and get no points!)'
        ];
      case 'medium':
        return [
          'A balanced challenge.',
          'Get within 7 chapters',
          '8x multiplier',
          'Extra points for exact chapter or verse!',
          '(If not within chapter range you',
          'lose a life and get no points!)'
        ];
      case 'hard':
        return [
          'Test your knowledge!',
          'Get within 3 chapters',
          '12x multiplier',
          'Extra points for exact chapter or verse!',
          '(If not within chapter range you',
          'lose a life and get no points!)'
        ];
      default:
        return [
          'Please select a difficulty to see the description.'
        ];
    }
  };

  return (
    <div className="start-screen">
      <div className='top-row'>
        <div className="username-button">
          <Button variant="text" onClick={handleUsernameClick}>
            {storedUsername ? `${storedUsername}` : 'Set Username'}
          </Button>
          {showUsernameModal && (
            <UsernameEntry setUsername={handleUsernameChange} startGame={startGame} onClose={() => setShowUsernameModal(false)} />
          )}
        </div>
        <Button variant="text" onClick={handleViewLeaderboard}>Leaderboard</Button>
      </div>
      <h1>Lehi's Legacy</h1>
      <div className="button-group">
        <ButtonGroup variant="contained">
          <Button
            onClick={() => setDifficulty('easy')}
            color={difficulty === 'easy' ? 'primary' : 'inherit'}
          >
            Easy
          </Button>
          <Button
            onClick={() => setDifficulty('medium')}
            color={difficulty === 'medium' ? 'primary' : 'inherit'}
          >
            Medium
          </Button>
          <Button
            onClick={() => setDifficulty('hard')}
            color={difficulty === 'hard' ? 'primary' : 'inherit'}
          >
            Hard
          </Button>
        </ButtonGroup>
      </div>
      <h3>{getDifficultyDescription()[0]}</h3>
      <p>{getDifficultyDescription()[1]}</p>
      <p>{getDifficultyDescription()[2]}</p>
      <h4>{getDifficultyDescription()[3]}</h4>
      <h5 className='fine-print'>{getDifficultyDescription()[4]}</h5>
      <h5 className='fine-print'>{getDifficultyDescription()[5]}</h5>
      <div className="start-button-container">
        <Button variant="contained" onClick={handleStart} disabled={!difficulty}>Start Game</Button>
      </div>
    </div>
  );
}

export default StartScreen;