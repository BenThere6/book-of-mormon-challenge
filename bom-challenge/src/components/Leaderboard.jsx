import React, { useState, useEffect } from 'react';

function Leaderboard({ score }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5005/leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error('Error fetching leaderboard:', error));
  }, []);

  const handleSaveScore = (username) => {
    if (!username) {
      console.error('Username is required');
      return;
    }

    fetch('http://localhost:5005/leaderboard', {
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
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error('Error saving score:', error));
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.username}: {entry.score}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Username"
        onBlur={(e) => handleSaveScore(e.target.value)}
      />
    </div>
  );
}

export default Leaderboard;