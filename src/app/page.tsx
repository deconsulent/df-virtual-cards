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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', background: '#f8fafc', color: '#0f172a' }}>
      <div style={{ 
        width: '100%', maxWidth: '420px', 
        padding: '40px', 
        background: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img src="/rtuin.png" alt="RTU Innovation Logo" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#0f172a' }}>Welcome Back</h1>
        <p style={{ color: '#64748b', marginBottom: '30px', textAlign: 'center' }}>Sign in to manage your Virtual Card.</p>
        
        {error && <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="e.g. elina-mikelsone"
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', background: '#623cea', border: 'none', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
