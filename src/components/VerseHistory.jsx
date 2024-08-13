import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100vw',
                overflow: 'hidden',
                position: 'relative',
                fontFamily: 'EB Garamond, serif',
                fontSize: '20px'
            }}
        >
            {/* Background Image Box */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('/background-images/history-image.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        mixBlendMode: 'darken',
                    },
                }}
            />
            {/* Main Container */}
            <Container
                sx={{
                    textAlign: 'center',
                    padding: 4,
                    borderRadius: 2,
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    overflowY: 'hidden',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                {/* Header Box */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon style={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h4" sx={{ ml: 2, color: 'white' }}>Verse History</Typography>
                </Box>
                <div className='history-content-container'>
                    {Object.keys(reversedVerseHistory).map(date => (
                        <Box key={date} sx={{ mb: 4, textAlign: 'left', maxWidth: '80%', mx: 'auto' }}>
                            <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
                                {formatDate(date)}
                            </Typography>
                            {Object.keys(reversedVerseHistory[date])
                                .sort((a, b) => b - a)
                                .map(gameID => (
                                    <Paper key={gameID} elevation={3} className="game-section" sx={{ p: 2, mb: 2, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
                                        <Typography variant="h6" sx={{ mb: 1 }}>Game #{gameID}</Typography>
                                        {[...reversedVerseHistory[date][gameID]].reverse().map((verseData, index) => (
                                            <div
                                                key={index}
                                                className={`${verseData.isCorrect === null ? '' : (verseData.isCorrect ? 'correct' : 'incorrect')} ${verseData.exactGuess ? 'exact-guess' : ''}`}
                                            >
                                                {verseData.verse}
                                            </div>
                                        ))}
                                    </Paper>
                                ))}
                        </Box>
                    ))}
                </div>
            </Container>
        </Box>
    );
};

export default VerseHistory;