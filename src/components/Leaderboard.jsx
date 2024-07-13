import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/Leaderboard.css';
import Button from '@mui/material/Button';

const apiurl = 'https://bens-api-dd63362f50db.herokuapp.com/leaderboard/';

const Leaderboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const fromStartScreen = location.state?.fromStartScreen || false;
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [userRank, setUserRank] = useState(null);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !isScoreSubmitted && !isSubmittingRef.current) {
      setUsername(storedUsername);
      isSubmittingRef.current = true; // Set flag to indicate score submission is in progress
      submitScore(storedUsername, score);
    }
    fetchLeaderboard();
  }, [isScoreSubmitted, score]);

  const fetchLeaderboard = () => {
    fetch(apiurl)
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
    const storedGameIDs = localStorage.getItem('gameIDs');
    let gameIDs = storedGameIDs ? JSON.parse(storedGameIDs) : {};

    const latestGameID = Object.keys(gameIDs).length > 0 ? Math.max(...Object.keys(gameIDs)) : null;
    console.log('latest game id: ' + latestGameID);

    if (latestGameID !== null && gameIDs[latestGameID] === true) {
      console.log(`Score for game ID ${latestGameID} already submitted.`);
      isSubmittingRef.current = false; // Reset flag if score is already submitted
      return;
    }

    console.log('Submitting score:', { username, score });

    fetch(apiurl, {
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

        setIsScoreSubmitted(true);
        isSubmittingRef.current = false; // Reset flag after submission

        if (latestGameID !== null) {
          gameIDs[latestGameID] = true;
          localStorage.setItem('gameIDs', JSON.stringify(gameIDs));
        }

        fetchLeaderboard();
      })
      .catch((error) => {
        console.error('Error saving score:', error);
        isSubmittingRef.current = false; // Reset flag on error
      });
  };

  const handlePlayAgain = () => {
    setUsername('');
    setIsScoreSubmitted(false);
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
        <div className="play-again">
          <Button variant="contained" onClick={handlePlayAgain}>Play Again</Button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;