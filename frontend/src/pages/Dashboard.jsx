import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-welcome">
        <h2>Welcome back, {user?.name}!</h2>
        <p>Manage your feedback and explore the application.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📝 Feedback</h3>
          <p>View and manage your feedback items</p>
          <Link to="/feedback" className="btn btn-primary">
            View Feedback
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>➕ Create Feedback</h3>
          <p>Submit new feedback</p>
          <Link to="/feedback/create" className="btn btn-primary">
            Create New
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>👤 Profile</h3>
          <p>Email: {user?.email}</p>
          <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
