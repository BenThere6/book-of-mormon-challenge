import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';

const VerseHistory = () => {
  const [servedVerses, setServedVerses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedVerses = JSON.parse(localStorage.getItem('servedVerses')) || {};
    setServedVerses(storedVerses);
  }, []);

  const getReversedServedVerses = (verses) => {
    // Sort the dates in descending order
    const reversedDates = Object.keys(verses).sort((a, b) => new Date(b) - new Date(a));
    const reversedServedVerses = {};

    reversedDates.forEach(date => {
      // Reverse the verses for each date
      reversedServedVerses[date] = verses[date].slice().reverse();
    });

    return reversedServedVerses;
  };

  const convertToLocalDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const reversedServedVerses = getReversedServedVerses(servedVerses);

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
          {Object.keys(reversedServedVerses).map(date => (
            <div key={date} className="date-section">
              <h3>{convertToLocalDate(date)}</h3>
              <ul>
                {reversedServedVerses[date].map((verse, index) => (
                  <li key={index}>{verse}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollIndicatorContainer>
    </div>
  );
};

export default VerseHistory;