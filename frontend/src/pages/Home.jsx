import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Freedback</h1>
        <p className="hero-subtitle">A Full Stack Web Application Template</p>
        <p className="hero-description">
          Built with React, Node.js, Express, and PostgreSQL. This template provides
          authentication, CRUD operations, and a modern user interface.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              <Link to="/feedback" className="btn btn-secondary">
                View Feedback
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Authentication</h3>
            <p>JWT-based authentication with secure password hashing</p>
          </div>
          <div className="feature-card">
            <h3>📊 CRUD Operations</h3>
            <p>Complete Create, Read, Update, Delete functionality</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Modern UI</h3>
            <p>Clean and responsive React-based interface</p>
          </div>
          <div className="feature-card">
            <h3>🚀 RESTful API</h3>
            <p>Express.js backend with organized routes and controllers</p>
          </div>
          <div className="feature-card">
            <h3>💾 Database Ready</h3>
            <p>PostgreSQL integration with Prisma ORM</p>
          </div>
          <div className="feature-card">
            <h3>🔧 Easy Setup</h3>
            <p>Docker support and comprehensive documentation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
