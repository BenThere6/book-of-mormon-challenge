import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/Leaderboard.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Leaderboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const fromStartScreen = location.state?.fromStartScreen || false;
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = () => {
    fetch('https://bens-api-dd63362f50db.herokuapp.com/leaderboard')
      .then(response => {
        if (!response.ok) {
          console.log("API response was not 'ok'");
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data fetched:', data);
        setLeaderboard(data);
        findUserRank(data);
      })
      .catch(error => console.error('Error fetching leaderboard:', error));
  };

  const findUserRank = (data) => {
    const sortedLeaderboard = [...data].sort((a, b) => b.score - a.score);
    const userIndex = sortedLeaderboard.findIndex(entry => entry.username === username && entry.score === score);
    setUserRank(userIndex !== -1 ? userIndex + 1 : null);
  };

  const handleSaveScore = (event) => {
    event.preventDefault(); // Prevent form submission

    if (!username) {
      console.error('Username is required');
      return;
    }

    console.log('Saving score:', { username, score });

    fetch('https://bens-api-dd63362f50db.herokuapp.com/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Score saved, response:', data);

        // Fetch the leaderboard again to get the updated data
        fetchLeaderboard();

        setIsSubmitted(true); // Set isSubmitted to true after successful submission
      })
      .catch((error) => console.error('Error saving score:', error));
  };

  const handlePlayAgain = () => {
    setUsername('');
    setIsSubmitted(false);
    navigate('/'); // Navigate to the start screen
  };

  const isUserInTopTen = index => {
    return userRank !== null && index === userRank - 1;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard">
        {!fromStartScreen && <h2>Your Current Score: {score}</h2>}
        <h2>Leaderboard</h2>
        <ol>
          {leaderboard.map((entry, index) => (
            <li key={index} className={isUserInTopTen(index) ? 'highlighted' : ''}>
              <span className="rank">{index + 1}.</span>
              <span className="username">{entry.username}</span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ol>
        {fromStartScreen ? (
          <div className="play-again">
            <Button variant="contained" onClick={handlePlayAgain}>Play Game</Button>
          </div>
        ) : (
          isSubmitted ? (
            <div className="play-again">
              <Button variant="contained" onClick={handlePlayAgain}>Play Again</Button>
            </div>
          ) : (
            <form onSubmit={handleSaveScore}>
              <TextField
                label="Username"
                variant="outlined"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                fullWidth
                inputProps={{ maxLength: 15 }} // Limit the maximum number of characters to 15
              />
              <div className="button-container">
                <Button variant="contained" type="submit">Submit Score</Button>
                <Button 
                  variant="contained" 
                  onClick={handlePlayAgain} 
                  disabled={username.trim().length > 0}
                >
                  Play Again
                </Button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}

export default Leaderboard;