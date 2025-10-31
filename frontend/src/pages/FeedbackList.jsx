import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as feedbackService from '../services/feedbackService';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ category: '', status: '' });

  useEffect(() => {
    loadFeedback();
  }, [filter]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAllFeedback(filter);
      setFeedback(data.feedback);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await feedbackService.deleteFeedback(id);
      setFeedback(feedback.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete feedback');
    }
  };

  if (loading) {
    return <div className="loading">Loading feedback...</div>;
  }

  return (
    <div className="feedback-list">
      <div className="feedback-header">
        <h1>Feedback</h1>
        <Link to="/feedback/create" className="btn btn-primary">
          Create New Feedback
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="feedback-filters">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="improvement">Improvement</option>
          <option value="general">General</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {feedback.length === 0 ? (
        <div className="no-feedback">
          <p>No feedback found. Create your first feedback item!</p>
        </div>
      ) : (
        <div className="feedback-items">
          {feedback.map((item) => (
            <div key={item.id} className="feedback-item">
              <div className="feedback-item-header">
                <h3>{item.title}</h3>
                <span className={`status-badge status-${item.status}`}>
                  {item.status}
                </span>
              </div>
              <p className="feedback-description">{item.description}</p>
              <div className="feedback-meta">
                <span className="category">{item.category}</span>
                <span className="date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="feedback-actions">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
