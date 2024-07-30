import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import '../assets/css/Leaderboard.css';

const apiurl = 'https://bens-api-dd63362f50db.herokuapp.com/leaderboard/';

const Leaderboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;
  const fromStartScreen = location.state?.fromStartScreen || false;
  const initialDifficulty = location.state?.difficulty || localStorage.getItem('latestDifficulty') || 'medium';
  const initialCategory = 'all-verses';
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [userRank, setUserRank] = useState(null);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [category, setCategory] = useState(initialCategory);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !isScoreSubmitted && !isSubmittingRef.current) {
      setUsername(storedUsername);
      isSubmittingRef.current = true;
      submitScore(storedUsername, score);
    }
    fetchLeaderboard();
  }, [isScoreSubmitted, score, difficulty, category]);

  const fetchLeaderboard = () => {
    fetch(`${apiurl}${difficulty}/${category}`)
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
      isSubmittingRef.current = false;
      return;
    }

    console.log('Submitting score:', { username, score, difficulty, category });

    fetch(`${apiurl}${difficulty}/${category}`, {
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
        isSubmittingRef.current = false;

        if (latestGameID !== null) {
          gameIDs[latestGameID] = true;
          localStorage.setItem('gameIDs', JSON.stringify(gameIDs));
        }

        fetchLeaderboard();
      })
      .catch((error) => {
        console.error('Error saving score:', error);
        isSubmittingRef.current = false;
      });
  };

  const handlePlayAgain = () => {
    setUsername('');
    setIsScoreSubmitted(false);
    navigate('/');
  };

  const findUserRank = (data) => {
    const sortedLeaderboard = [...data].sort((a, b) => b.score - a.score);
    const userIndex = sortedLeaderboard.findIndex(entry => entry.username === username && entry.score === score);
    setUserRank(userIndex !== -1 ? userIndex + 1 : null);
  };

  const isUserInTopTen = (entry) => {
    const latestDifficulty = localStorage.getItem('latestDifficulty');
    const latestScore = localStorage.getItem('gameScore');
    const latestUsername = localStorage.getItem('username');

    return (
      latestDifficulty === difficulty &&
      entry.score === parseInt(latestScore, 10) &&
      entry.username === latestUsername
    );
  };

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
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('/background-images/leaderboard-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }}
      />
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
          marginTop: '20px', // Added margin to prevent content from being hidden
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            width: '100%',
            position: 'sticky', // Make the element sticky
            top: 0, // Stick to the top of the container
            zIndex: 1, // Ensure it stays above other content
            borderRadius: 2, // Maintain the border radius
            paddingBottom: 1,
            boxSizing: 'border-box', // Ensure padding and border are included in the height
            '@media (max-width: 550px)': {
              flexDirection: 'row', // Keep elements in a row on smaller screens
              alignItems: 'center',
              justifyContent: 'space-between', // Space between elements on smaller screens
              width: '100%',
            }
          }}
        >
          {!fromStartScreen && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: 5, 
                padding: 2,
                height: '100%',
                fontSize: '2rem',
                color: 'white',
                mr: 2, // Add some margin to the right
                flex: '1 1 auto', // Ensure it takes up only necessary space
                whiteSpace: 'nowrap', // Ensure the score doesn't wrap
                boxSizing: 'border-box', // Ensure padding and border are included in the height
                display: 'flex', // Ensure the element stays flex on smaller screens
                justifyContent: 'center', // Center content horizontally
                alignItems: 'center', // Center content vertically
                '@media (max-width: 550px)': {
                  fontSize: '3rem', // Double the font size on smaller screens
                  textAlign: 'center', // Center text
                  mr: 2, // Remove right margin
                  mb: 0, // Remove bottom margin
                }
              }}
            >
              <Box className='user-score' sx={{ width: 'auto' }}>{score}</Box>
            </Box>
          )}

          <FormControl component="fieldset" sx={{ width: '70%', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 5, padding: 2, boxSizing: 'border-box', '@media (max-width: 550px)': { width: 'auto', flex: '1 1 30%' } }}>
            <RadioGroup
              row
              aria-label="difficulty"
              name="difficulty"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: 'white',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
                justifyContent: 'space-around',
                width: '100%',
                boxSizing: 'border-box', // Ensure padding and border are included in the height
                '@media (max-width: 550px)': {
                  flexDirection: 'column', // Stack radio buttons vertically on smaller screens
                  alignItems: 'flex-start', // Align items to the left
                }
              }}
            >
              <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              <FormControlLabel value="medium" control={<Radio />} label="Medium" />
              <FormControlLabel value="hard" control={<Radio />} label="Hard" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box 
          component="ol" 
          className='scroll-shadow'
          sx={{ 
            padding: 0, 
            width: '100%', 
            marginTop: 0,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          {leaderboard.map((entry, index) => (
            <Box 
              component="li" 
              key={index} 
              sx={{ 
                listStyle: 'none', 
                padding: 2, 
                color: 'white', 
                marginBottom: .5, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: 2, 
                border: isUserInTopTen(entry) ? '2px solid white' : 'none'
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs={2}>
                  <span className="rank">{index + 1}.</span>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'left' }}>
                  <span className="username">{entry.username}</span>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <span className="score">{entry.score}</span>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
        <div className="play-again">
          <Button variant="contained" onClick={handlePlayAgain}>Home</Button>
        </div>
      </Container>
    </Box>
  );
}

export default Leaderboard;