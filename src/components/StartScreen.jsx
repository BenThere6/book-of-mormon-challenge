import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import UsernameEntry from './Username'; // Import Username component
import UpdateModal from './UpdateModal'; // Import the UpdateModal component
import DevelopmentModal from './DevelopmentModal'; // Import the DevelopmentModal component
import '../assets/css/StartScreen.css';

const UPDATE_VERSION = '1.5.0'; // Change this version number when there's a new update
const UPDATE_MESSAGE = [
  'There is now a leaderboard for each difficulty.',
  'Added feedback section.',
];
const DEVELOPMENT_MESSAGE = 'This application is currently under development. You might encounter bugs, design flaws, or areas that could be improved. If you notice any issues or have suggestions for enhancements, please click the feedback button in the bottom left corner of the start screen to share your thoughts.';

const token = localStorage.getItem('token');

function StartScreen({ startGame }) {
  const [difficulty, setDifficulty] = useState(''); // Default to empty string
  const [showUsernameModal, setShowUsernameModal] = useState(false); // State for showing Username modal
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false); // State for showing Development modal
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for showing Update modal
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem('username');
  const storedUpdateVersion = localStorage.getItem('updateVersion');
  const storedDevelopmentNotice = localStorage.getItem('developmentNotice');

  const handleFeedbackClick = () => {
    navigate('/feedback', { state: { username: storedUsername } });
  };

  useEffect(() => {
    if (storedUpdateVersion !== UPDATE_VERSION) {
      setShowUpdateModal(true);
    }
    if (!storedDevelopmentNotice) {
      setShowDevelopmentModal(true);
    }
  }, [storedUpdateVersion, storedDevelopmentNotice]);

  const handleDevelopmentModalClose = () => {
    setShowDevelopmentModal(false);
    localStorage.setItem('developmentNotice', 'shown');
  };

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
    localStorage.setItem('gameCurrentVerse', '');

    // Generate game ID object if it doesn't exist in localStorage
    let gameIDs = JSON.parse(localStorage.getItem('gameIDs')) || {};
    const newGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) + 1 : 1;
    gameIDs[newGameID] = false; // Initialize new game ID with false

    localStorage.setItem('gameIDs', JSON.stringify(gameIDs));

    const category = difficulty === 'easy' ? 'scripture-mastery' : 'all-verses';

    if (storedUsername) {
      startGame(newGameID, difficulty, category); // Pass gameID, difficulty, and category to startGame function
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

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    localStorage.setItem('updateVersion', UPDATE_VERSION);
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
        <div className="image-container">
          <img id="title" src="/title.png" alt="Lehi's Legacy" />
        </div>
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
        <h3 className='this'> {getDifficultyDescription()[0]}</h3>
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
        <Button id='feedback-button' variant="text" onClick={handleFeedbackClick}>Feedback</Button>
        {token && <Link className='admin-link' to="/admin">Admin Dashboard</Link>}
      </div>
      <DevelopmentModal
        open={showDevelopmentModal}
        onClose={handleDevelopmentModalClose}
        developmentMessage={DEVELOPMENT_MESSAGE}
      />
      <UpdateModal open={showUpdateModal} onClose={handleUpdateModalClose} updateMessage={UPDATE_MESSAGE} updateVersion={UPDATE_VERSION} />
    </div>
  );
}

export default StartScreen;