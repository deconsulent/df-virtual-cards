import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { UserProfile } from '@/data/mockData';
import Directory from '@/components/Directory';

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '40px 20px' }}>
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
      <Directory initialUsers={users} />
    </div>
  );
}
