import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography, Container, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const apiurl = 'https://bens-api-dd63362f50db.herokuapp.com/admin/';

const Admin = () => {
  const [feedback, setFeedback] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
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

  const handleDeleteClick = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (deleteType === 'feedback') {
        await fetch(`${apiurl}feedback/${itemToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFeedback(feedback.filter((item) => item.id !== itemToDelete));
      } else if (deleteType === 'score') {
        await fetch(`${apiurl}scores/${itemToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setScores(scores.filter((item) => item.id !== itemToDelete));
      }
      setOpenDialog(false);
      setItemToDelete(null);
      setDeleteType('');
    } catch (error) {
      console.error('Error deleting item:', error);
      setOpenDialog(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth={false} sx={{ width: '100%', padding: 0, boxSizing: 'border-box' }}>
      <Typography variant="h4" component="div" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Link to="/" style={{ textDecoration: 'none' }}>
        </Link>
      </Box>
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Analytics" sx={{ '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Feedback" sx={{ '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Scores" sx={{ '&.Mui-selected': { color: 'white' } }} />
          <Tab label="Home" component={Link} sx={{ '&.Mui-selected': { color: 'white' } }} to="/" />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <Analytics uniqueUsers={uniqueUsers} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Feedback feedback={feedback} onDeleteClick={handleDeleteClick} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Scores scores={scores} onDeleteClick={handleDeleteClick} />
      </TabPanel>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {deleteType}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: '100%' }}>
      {value === index && (
        <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
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

const Feedback = ({ feedback, onDeleteClick }) => (
  <Paper elevation={3} style={{ padding: '16px', maxHeight: '50vh', overflowY: 'auto' }}>
    <Typography variant="h6">Feedback</Typography>
    {feedback.map((item, index) => (
      <Box key={index} marginBottom={2} padding={2} border={1} borderRadius={4} borderColor="grey.300" display="flex" justifyContent="space-between">
        <Box>
          <Typography><strong>User:</strong> {item.username}</Typography>
          <Typography><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</Typography>
          <Typography><strong>Feedback:</strong> {item.feedback}</Typography>
        </Box>
        <IconButton onClick={() => onDeleteClick(item.id, 'feedback')}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ))}
  </Paper>
);

const Scores = ({ scores, onDeleteClick }) => {
  const [filterUsername, setFilterUsername] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'score', order: 'desc' });

  const handleSortChange = (field) => {
    setSortOrder((prevState) => ({
      field,
      order: prevState.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const uniqueUsernames = [...new Set(scores.map((item) => item.username))];

  const filteredScores = scores
    .filter((item) => (filterUsername ? item.username.includes(filterUsername) : true))
    .filter((item) => (filterDifficulty ? item.difficulty === filterDifficulty : true))
    .sort((a, b) => {
      if (sortOrder.order === 'asc') {
        return a[sortOrder.field] > b[sortOrder.field] ? 1 : -1;
      }
      return a[sortOrder.field] < b[sortOrder.field] ? 1 : -1;
    });

  return (
    <Paper elevation={3} style={{ padding: '16px', maxHeight: '50vh', overflowY: 'auto' }}>
      <Typography variant="h6">Scores</Typography>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Username</InputLabel>
          <Select value={filterUsername} onChange={(e) => setFilterUsername(e.target.value)}>
            <MenuItem value=""><em>None</em></MenuItem>
            {uniqueUsernames.map((username, index) => (
              <MenuItem key={index} value={username}>{username}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button onClick={() => handleSortChange('username')}>Sort by Username</Button>
        <Button onClick={() => handleSortChange('score')}>Sort by Score</Button>
        <Button onClick={() => handleSortChange('difficulty')}>Sort by Difficulty</Button>
      </Box>
      {filteredScores.map((item, index) => (
        <Box key={index} marginBottom={2} padding={2} border={1} borderRadius={4} borderColor="grey.300" display="flex" justifyContent="space-between">
          <Box>
            <Typography><strong>User:</strong> {item.username}</Typography>
            <Typography><strong>Score:</strong> {item.score}</Typography>
            <Typography><strong>Difficulty:</strong> {item.difficulty}</Typography>
            <Typography><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</Typography>
          </Box>
          <IconButton onClick={() => onDeleteClick(item.id, 'score')}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Paper>
  );
};

export default Admin;