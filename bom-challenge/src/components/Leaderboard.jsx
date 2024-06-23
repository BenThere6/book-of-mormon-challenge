import React, { useState, useEffect } from 'react';

function Leaderboard({ score }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/leaderboard')
      .then((response) => response.json())
      .then((data) => setLeaderboard(data));
  }, []);

  const handleSaveScore = (username) => {
    fetch('http://localhost:5000/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score }),
    })
      .then((response) => response.json())
      .then((data) => setLeaderboard(data));
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.username}: {entry.score}</li>
        ))}
      </ul>
      <input type="text" placeholder="Username" onBlur={(e) => handleSaveScore(e.target.value)} />
    </div>
  );
}

export default Leaderboard;