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
          'Only scripture mastery verses',
          '8',
          '1x'
        ];
      case 'medium':
        return [
          'Any Book of Mormon verse',
          '7',
          '8x'
        ];
      case 'hard':
        return [
          'Any Book of Mormon verse',
          '3',
          '12x'
        ];
      default:
        return [
          'Select a difficulty to see the description.'
        ];
    }
  };

  return (
    <div className='centered-element'>
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
        <h1 id='start-title'>Lehi's Legacy</h1>
        {/* <div className="image-container">
          <img id="logo" className='faded-image' src="/images/logo.png" alt="Game Logo" />
        </div> */}
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
        <div className='difficulty-details-container'>
          <div>
            {difficulty && <p className='detail-title'>Chapter Margin</p>}
            <p>{getDifficultyDescription()[1]}</p>
          </div>
          <div>
            {difficulty && <p className='detail-title'>Points Multiplier</p>}
            <p>{getDifficultyDescription()[2]}</p>
          </div>
        </div>
        <div className="start-button-container">
          <Button variant="contained" onClick={handleStart} disabled={!difficulty}>Start Game</Button>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;