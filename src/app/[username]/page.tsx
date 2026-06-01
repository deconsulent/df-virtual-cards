import React from 'react';
import VirtualCard from '@/components/VirtualCard';
import { notFound } from 'next/navigation';
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

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const users = getUsers();
  const user = users.find(u => u.username === resolvedParams.username);

  if (!user) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <VirtualCard user={user} />
    </div>
  );
}
