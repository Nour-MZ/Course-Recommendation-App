import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './LoginScreen.css'; // Create a CSS file for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginScreen = () => {
  const { setUser, user } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      console.log(userData)
      setUser(userData); // Set user data in context
      navigate('/');
    } else {
      alert('Login failed');
    }

  };

  return (
    <div className="login-screen">
      <div className="login-logo-div">
        <div className="login-logo-container">
          <div className="login-logo">
            <img src="/assets/images/logo.png" alt="" srcset="" />
          </div>
          <h2 className="logo-title">Elevate <span className="colored-text-login">Academy</span></h2>
        </div>
      </div>
    
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          
          <input
            placeholder='Email'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          
          <input
            placeholder='Password'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginScreen;