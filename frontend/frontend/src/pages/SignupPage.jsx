import React, { useState } from 'react';

export default function SignupPage({ onSignup }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pubkey, setPubkey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !password || !pubkey) {
      setError('Please enter all fields.');
      return;
    }
    setError('');
    onSignup(name, password, pubkey);
  };

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">Create Account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="signup-input"
        />
        <input
          type="text"
          placeholder="Public Key"
          value={pubkey}
          onChange={e => setPubkey(e.target.value)}
          className="signup-input"
        />
        {error && <div className="signup-error">{error}</div>}
        <button type="submit" className="signup-button">Create Account</button>
      </form>
    </div>
  );
}
