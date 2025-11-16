import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, password });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back! 👋</h2>
          <p className="auth-subtitle">Sign in to continue your fitness journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            🚀 Sign In
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-switch">
            New to Elite Fitness? 
            <span onClick={switchToRegister} className="switch-link">
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;