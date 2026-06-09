"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/data/mockData';
import { Search } from 'lucide-react';

export default function Directory({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [search, setSearch] = useState('');

  const filteredUsers = initialUsers.filter(user => {
    const term = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.skills.some(skill => skill.toLowerCase().includes(term)) ||
      user.superpower.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ position: 'relative', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px auto' }}>
        <input 
          type="text" 
          placeholder="Search by name, role, or skill..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 20px 12px 45px',
            borderRadius: '25px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <Search size={20} style={{ position: 'absolute', left: '15px', top: '12px', color: '#cbd5e1' }} />
      </div>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filteredUsers.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No team members found matching "{search}"</p>
        ) : (
          filteredUsers.map(user => (
            <Link key={user.id} href={`/${user.username}`} style={{ 
              textDecoration: 'none', 
              background: 'rgba(255,255,255,0.05)', 
              padding: '15px 25px', 
              borderRadius: '8px', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'background 0.3s'
            }}>
              {user.name} <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>- {user.role}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
