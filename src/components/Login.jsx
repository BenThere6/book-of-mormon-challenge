import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://bens-api-dd63362f50db.herokuapp.com/leaderboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }), // Include rememberMe in the request body
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          const tokenParts = data.token.split('.');
          if (tokenParts.length === 3) {
            const decodedPayload = JSON.parse(atob(tokenParts[1]));
            const tokenExpiration = decodedPayload.exp * 1000; // In milliseconds
            console.log('token expiration set for ' + decodedPayload.exp / 60 + ' minutes.')
  
            if (rememberMe) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('tokenExpiration', tokenExpiration);
            } else {
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('tokenExpiration', tokenExpiration);
            }
  
            navigate('/admin');
          } else {
            setError('Login failed, please try again.');
          }
        } else {
          setError('Login failed, please try again.');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    }
  };
  
  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="centered-element">
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  name="rememberMe"
                  color="primary"
                />
              }
              label="Remember Me"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleHome} sx={{ ml: 2 }}>
                Home
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;