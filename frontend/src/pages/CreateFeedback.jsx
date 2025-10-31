import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as feedbackService from '../services/feedbackService';
import './CreateFeedback.css';

const CreateFeedback = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await feedbackService.createFeedback({ title, description, category });
      navigate('/feedback');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-feedback">
      <h1>Create New Feedback</h1>
      
      <div className="card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter a descriptive title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide detailed information about your feedback"
              rows="6"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/feedback')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeedback;
