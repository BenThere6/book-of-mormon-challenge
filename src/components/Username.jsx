import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../assets/css/Username.css';

function UsernameEntry({ setUsername, startGame, onClose }) {
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
        onClose(); // Close modal after username is set
    };

    const handleCancel = () => {
        onClose(); // Close modal on cancel
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className='centered-screen'>
            <div className='username-screen'>
                <div className="username-entry">
                    <h1 id='enter-username'>Enter Your Username</h1>
                    <TextField
                        id="username-input"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={usernameInput}
                        onChange={handleUsernameChange}
                        onKeyDown={handleKeyPress}
                        inputProps={{ maxLength: 15 }}
                        required
                    />
                    <div className="submit-button-container" style={{ marginTop: '10px' }}>
                        <Button id="username-cancel-btn" variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsernameEntry;