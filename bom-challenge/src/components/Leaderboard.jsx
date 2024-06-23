import React, { useState, useEffect } from 'react';

function Leaderboard({ score }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSaveScore = () => {
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
      .then((data) => {
        setLeaderboard(data);
        setIsSubmitted(true); // Set isSubmitted to true after successful submission
      })
      .catch((error) => console.error('Error saving score:', error));
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.username}: {entry.score}</li>
        ))}
      </ol>
      {!isSubmitted && (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleSaveScore}>Submit Score</button>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;