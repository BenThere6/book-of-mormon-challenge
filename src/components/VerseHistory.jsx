import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';
import '../assets/css/VerseHistory.css';

const VerseHistory = () => {
  const [verseHistory, setVerseHistory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('verseHistory')) || {};
    setVerseHistory(storedHistory);
  }, []);

  const getReversedVerseHistory = (history) => {
    const reversedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));
    const reversedHistory = {};

    reversedDates.forEach(date => {
      reversedHistory[date] = {};
      const gameIDs = Object.keys(history[date]).sort((a, b) => b - a);
      gameIDs.forEach(gameID => {
        reversedHistory[date][gameID] = history[date][gameID].slice().reverse();
      });
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
              {Object.keys(reversedVerseHistory[date]).map(gameID => (
                <div key={gameID} className="game-section">
                  <h4>Game ID: {gameID}</h4>
                  <ul>
                    {reversedVerseHistory[date][gameID].map((entry, index) => (
                      <li key={index} className={entry.correct ? 'correct' : 'incorrect'}>
                        {entry.verse}
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