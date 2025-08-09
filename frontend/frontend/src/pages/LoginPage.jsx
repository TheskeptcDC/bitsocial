import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    onLogin(username, password);
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">Login to bitSocial</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input"
        />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}
