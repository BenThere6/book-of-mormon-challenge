import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ScrollIndicatorContainer from './ScrollIndicatorContainer';
import '../assets/css/VerseHistory.css';

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const reversedVerseHistory = getReversedVerseHistory(verseHistory);

    return (
        <Container maxWidth="md" sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ ml: 2 }}>Verse History</Typography>
            </Box>
            <ScrollIndicatorContainer>
                <div className='history-content-container'>
                    {Object.keys(reversedVerseHistory).map(date => (
                        <Box key={date} sx={{ mb: 4, textAlign: 'left', maxWidth: '80%', mx: 'auto' }}>
                            <Typography variant="h5" sx={{ mb: 2, color: '#3f51b5', fontWeight: 'bold' }}>
                                {formatDate(date)}
                            </Typography>
                            {Object.keys(reversedVerseHistory[date])
                                .sort((a, b) => b - a)
                                .map(gameID => (
                                    <Paper key={gameID} elevation={3} className="game-section" sx={{ p: 2, mb: 2, textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ mb: 1 }}>Game #{gameID}</Typography>
                                        {[...reversedVerseHistory[date][gameID]].reverse().map((verseData, index) => (
                                            <div key={index} className={verseData.isCorrect === null ? '' : (verseData.isCorrect ? 'correct' : 'incorrect')}>
                                                {verseData.verse}
                                            </div>
                                        ))}
                                    </Paper>
                                ))}
                        </Box>
                    ))}
                </div>
            </ScrollIndicatorContainer>
        </Container>
    );
};

export default VerseHistory;