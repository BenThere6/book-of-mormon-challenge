import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/Leaderboard.css';
import Button from '@mui/material/Button';

let count = 0;
function Leaderboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const fromStartScreen = location.state?.fromStartScreen || false;
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [userRank, setUserRank] = useState(null);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const [isScoreSubmitting, setIsScoreSubmitting] = useState(false); // New state to track score submission

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !isScoreSubmitted && !isScoreSubmitting) {
      setUsername(storedUsername);
      setIsScoreSubmitting(true); // Set flag to indicate score submission is in progress
      // Automatically submit score if username is retrieved and not already submitted
      submitScore(storedUsername, score);
    }

    fetchLeaderboard();
  }, [score, isScoreSubmitted, isScoreSubmitting]);

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

  const submitScore = (username, score) => {
    count ++;
    if (count !==1) {
      return;
    }
    // Retrieve game IDs from localStorage
    const storedGameIDs = localStorage.getItem('gameIDs');
    let gameIDs = storedGameIDs ? JSON.parse(storedGameIDs) : {};
  
    // Find the latest game ID
    const latestGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) : null;
    console.log('latest game id: ' + latestGameID)
    // Check if latest game ID exists and its status
    if (latestGameID !== null) {
      const latestGameIDStatus = gameIDs[latestGameID];
      if (latestGameIDStatus === true) {
        console.log(`Score for game ID ${latestGameID} already submitted.`);
        return;
      }
    }
  
    // Proceed to submit score
    console.log('Submitting score:', { username, score });
  
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
  
        setIsScoreSubmitted(true); // Set score submission flag to true
        setIsScoreSubmitting(false); // Reset score submission in progress flag
        fetchLeaderboard(); // Fetch leaderboard again to update data
  
        // Update game ID status in localStorage to true
        if (latestGameID !== null) {
          gameIDs[latestGameID] = true;
          localStorage.setItem('gameIDs', JSON.stringify(gameIDs));
        }
      })
      .catch((error) => {
        setIsScoreSubmitting(false); // Reset score submission in progress flag on error
        console.error('Error saving score:', error);
      });
  };
  
  const handlePlayAgain = () => {
    setUsername('');
    setIsScoreSubmitted(false);
    setIsScoreSubmitting(false); // Reset score submission in progress flag
    navigate('/'); // Navigate to the start screen
  };

  const findUserRank = (data) => {
    const sortedLeaderboard = [...data].sort((a, b) => b.score - a.score);
    const userIndex = sortedLeaderboard.findIndex(entry => entry.username === username && entry.score === score);
    setUserRank(userIndex !== -1 ? userIndex + 1 : null);
  };

  const isUserInTopTen = index => {
    return userRank !== null && index === userRank - 1;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard">
        {!fromStartScreen && <div className='center'><div className='user-score'>{score}</div></div>}
        <h2 className='leaderboard-title'>Leaderboard</h2>
        <ol>
          {leaderboard.map((entry, index) => (
            <li key={index} className={isUserInTopTen(index) ? 'highlighted' : ''}>
              <span className="rank">{index + 1}.</span>
              <span className="username">{entry.username}</span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ol>
        {(
          <div className="play-again">
            <Button variant="contained" onClick={handlePlayAgain}>Play Again</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;