import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';
import '../assets/css/VerseHistory.css'; // Ensure this is imported for the CSS styles

const VerseHistory = () => {
  const [verseHistory, setVerseHistory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedVerseHistory = JSON.parse(localStorage.getItem('verseHistory')) || {};
    setVerseHistory(storedVerseHistory);
  }, []);

  const getReversedVerseHistory = (history) => {
    const reversedHistory = {};
    const sortedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
      reversedHistory[date] = history[date];
    });

    return reversedHistory;
  };

  const convertToLocalDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const reversedVerseHistory = getReversedVerseHistory(verseHistory);

  return (
    <div className="verse-history-container">
      <div className='back-container'>
        <IconButton className="back-button" onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
      </div>
      <h2>Verse History</h2>
      <ScrollIndicatorContainer>
        <div className='history-content-container'>
          {Object.keys(reversedVerseHistory).map(date => (
            <div key={date} className="date-section">
              <h3>{convertToLocalDate(date)}</h3>
              {Object.keys(reversedVerseHistory[date])
                .sort((a, b) => b - a) // Sort game IDs in descending order
                .map(gameID => (
                  <div key={gameID} className="game-section">
                    <h4>Game ID: {gameID}</h4>
                    <ul>
                      {[...reversedVerseHistory[date][gameID]].reverse().map((verseData, index) => ( // Reverse the order of verses within each game
                        <li key={index} className={verseData.isCorrect ? 'correct' : 'incorrect'}>
                          {verseData.verse}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </ScrollIndicatorContainer>
    </div>
  );
};

export default VerseHistory;