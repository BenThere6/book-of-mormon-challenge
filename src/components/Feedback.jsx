import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  useEffect(() => {
    if (!username) {
      alert('Please set your username first.');
      navigate('/');
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      alert('Please set your username first.');
      return;
    }

    try {
      const response = await fetch('https://bens-api-dd63362f50db.herokuapp.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, feedback }),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setFeedback('');
        navigate('/');
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="centered-element feedback-container-container-lol">
      <div className="feedback-container">
        <h2>Feedback</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <div className="submit-button">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;