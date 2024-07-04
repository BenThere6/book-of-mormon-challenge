import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function UsernameEntry({ setUsername, startGame }) {
    const [usernameInput, setUsernameInput] = useState('');
    const location = useLocation();

    // Extract difficulty from location state
    const { difficulty } = location.state || {};

    const handleUsernameChange = (event) => {
        setUsernameInput(event.target.value);
    };

    const handleSubmit = () => {
        if (usernameInput.trim() === '') {
            alert('Please enter a valid username.');
            return;
        }
        setUsername(usernameInput.trim());
        localStorage.setItem('username', usernameInput.trim()); // Save username to local storage
        startGame(difficulty); // Start game with the correct difficulty
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className='start-screen'>
            <div className="username-entry">
                <h1>Enter Your Username</h1>
                <TextField
                    id="username-input"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={usernameInput}
                    onChange={handleUsernameChange}
                    onKeyDown={handleKeyPress}
                    required
                />
                <div className="submit-button-container">
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UsernameEntry;