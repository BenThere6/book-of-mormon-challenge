import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, Container, Paper } from '@mui/material';

const apiurl = 'https://bens-api-dd63362f50db.herokuapp.com/admin/';

const Admin = () => {
  const [feedback, setFeedback] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');

        const feedbackResponse = await fetch(`${apiurl}feedback`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const feedbackData = await feedbackResponse.json();

        const uniqueUsersResponse = await fetch(`${apiurl}unique-users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const uniqueUsersData = await uniqueUsersResponse.json();

        const scoresResponse = await fetch(`${apiurl}scores`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const scoresData = await scoresResponse.json();

        setFeedback(feedbackData);
        setUniqueUsers(uniqueUsersData.unique_users);
        setScores(scoresData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h2" component="div" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" color="primary">
            Home
          </Typography>
        </Link>
      </Box>
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Analytics" sx={{ '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Feedback" sx={{ '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Scores" sx={{ '&.Mui-selected': { color: 'white' } }} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <Analytics uniqueUsers={uniqueUsers} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Feedback feedback={feedback} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Scores scores={scores} />
      </TabPanel>
    </Container>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Analytics = ({ uniqueUsers }) => (
  <Paper elevation={3} style={{ padding: '16px' }}>
    <Typography variant="h6">Unique Users</Typography>
    <Typography>{uniqueUsers}</Typography>
  </Paper>
);

const Feedback = ({ feedback }) => (
  <Paper elevation={3} style={{ padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
    <Typography variant="h6">Feedback</Typography>
    {feedback.map((item, index) => (
      <Box key={index} marginBottom={2} padding={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography><strong>User:</strong> {item.username}</Typography>
        <Typography><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</Typography>
        <Typography><strong>Feedback:</strong> {item.feedback}</Typography>
      </Box>
    ))}
  </Paper>
);

const Scores = ({ scores }) => (
  <Paper elevation={3} style={{ padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
    <Typography variant="h6">Scores</Typography>
    {scores.map((item, index) => (
      <Box key={index} marginBottom={2} padding={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography><strong>User:</strong> {item.username}</Typography>
        <Typography><strong>Score:</strong> {item.score}</Typography>
        <Typography><strong>Difficulty:</strong> {item.difficulty}</Typography>
        <Typography><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</Typography>
      </Box>
    ))}
  </Paper>
);

export default Admin;