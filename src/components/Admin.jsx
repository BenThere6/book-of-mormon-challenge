import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [feedback, setFeedback] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');

        const feedbackResponse = await fetch('https://bens-api-dd63362f50db.herokuapp.com/admin/feedback', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const feedbackData = await feedbackResponse.json();

        const uniqueUsersResponse = await fetch('https://bens-api-dd63362f50db.herokuapp.com/admin/unique-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const uniqueUsersData = await uniqueUsersResponse.json();

        const scoresResponse = await fetch('https://bens-api-dd63362f50db.herokuapp.com/admin/scores', {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <section>
        <h3>Unique Users</h3>
        <p>{uniqueUsers}</p>
      </section>

      <section>
        <h3>Feedback</h3>
        {feedback.map((item, index) => (
          <div key={index} className="feedback-item">
            <p><strong>User:</strong> {item.username}</p>
            <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
            <p><strong>Feedback:</strong> {item.feedback}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Scores</h3>
        {scores.map((item, index) => (
          <div key={index} className="score-item">
            <p><strong>User:</strong> {item.username}</p>
            <p><strong>Score:</strong> {item.score}</p>
            <p><strong>Difficulty:</strong> {item.difficulty}</p>
            {/* <p><strong>Category:</strong> {item.category}</p> */}
            <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Admin;