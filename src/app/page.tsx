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

export default async function HomePage() {
  const users = getUsers();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>DF Virtual Cards</h1>
      <p style={{ color: '#cbd5e1', marginBottom: '2rem', maxWidth: '600px' }}>
        The official directory for the Riga Technical University Design Factory.
      </p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
          Employee Dashboard
        </Link>
        <Link href="/admin" className="btn-primary" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
          Admin Portal
        </Link>
      </div>

      <h2 style={{ marginBottom: '20px', color: '#ffb300' }}>Directory Preview</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {users.map(user => (
          <Link key={user.id} href={`/${user.username}`} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            {user.name} - {user.role}
          </Link>
        ))}
      </div>
    </div>
  );
}
