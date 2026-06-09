"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('loggedInUser', data.user.username);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ 
        width: '100%', maxWidth: '400px', 
        padding: '40px', 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '16px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>DF Portal Login</h1>
        <p style={{ color: '#cbd5e1', marginBottom: '30px', textAlign: 'center' }}>Sign in to edit your Virtual Card.</p>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="e.g. elina-mikelsone"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'center' }}>
          *Use <strong>designfactory2026</strong> for testing.
        </p>
      </div>
    </div>
  );
}
