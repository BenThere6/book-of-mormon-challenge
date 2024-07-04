import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function UsernameEntry({ setUsername }) {
  const [usernameInput, setUsernameInput] = useState('');
  const navigate = useNavigate();

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
    navigate('/game', { state: { difficulty } });
  };

  return (
    <div className="username-entry">
      <h1>Enter Your Username</h1>
      <TextField
        id="username-input"
        label="Username"
        variant="outlined"
        fullWidth
        value={usernameInput}
        onChange={handleUsernameChange}
        required
      />
      <div className="submit-button-container">
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default UsernameEntry;