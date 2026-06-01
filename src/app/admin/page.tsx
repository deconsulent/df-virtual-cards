import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { UserProfile } from '@/data/mockData';

// Helper to read data.json on the server side
function getUsers(): UserProfile[] {
  try {
    const dataFilePath = path.join(process.cwd(), 'data.json');
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const users = getUsers();

  return (
    <div className="dashboard-container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
          <p style={{ color: '#cbd5e1' }}>Manage DF Virtual Cards Directory</p>
        </div>
        <button className="btn-primary">+ Invite Employee</button>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Active Profiles</h2>
        
        {users.map(user => (
          <div key={user.id} className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={user.avatarUrl} alt={user.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontWeight: 'bold' }}>{user.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user.role}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link href={`/${user.username}`} style={{ color: '#623cea', textDecoration: 'none', fontWeight: '600' }}>
                View Card
              </Link>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                Disable
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
            <h3 style={{ fontSize: '2rem', color: '#10b981' }}>1,204</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Total Views (30d)</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: '#623cea' }}>342</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>vCard Downloads</p>
          </div>
        </div>
      </div>
    </div>
  );
}
