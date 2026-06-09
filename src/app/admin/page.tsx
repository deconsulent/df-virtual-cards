"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/data/mockData';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async () => {
    const username = prompt("Enter new employee username (e.g. john-doe):");
    if (!username) return;

    const name = prompt("Enter employee full name:");
    if (!name) return;

    const password = prompt("Enter a starting password:");
    if (!password) return;

    const newUser: Partial<UserProfile> = {
      username,
      name,
      password,
      role: "New Employee",
      superpower: "Add a superpower",
      skills: [],
      certifications: [],
      email: `${username}@rtu.lv`,
      linkedin: "",
      calendly: "",
      currentProject: "",
      isAvailable: true,
      avatarUrl: "/avatars/elina.png", // fallback
      theme: "default",
      layout: "vertical",
      views: 0
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`User ${name} created!`);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        toast.success(`${name} has been deleted.`);
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Panel...</div>;
  }

  const totalViews = users.reduce((acc, user) => acc + (user.views || 0), 0);

  return (
    <div className="dashboard-container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
          <p style={{ color: '#cbd5e1' }}>Manage DF Virtual Cards Directory</p>
        </div>
        <button className="btn-primary" onClick={handleInvite}>+ Invite Employee</button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Active Profiles</h2>
        
        {users.length === 0 ? <p>No profiles found.</p> : users.map(user => (
          <div key={user.id} className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={user.avatarUrl} alt={user.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontWeight: 'bold' }}>{user.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user.role} | {user.views || 0} views</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link href={`/${user.username}`} style={{ color: '#623cea', textDecoration: 'none', fontWeight: '600' }}>
                View Card
              </Link>
              <button 
                onClick={() => handleDelete(user.id, user.name)}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Analytics Overview</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#ffb300' }}>{users.length}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Active Cards</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#10b981' }}>{totalViews}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Total Profile Views</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#623cea' }}>?</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>vCard Downloads</p>
          </div>
        </div>
      </div>
    </div>
  );
}
