import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserProfile } from '@/data/mockData';

const dataFilePath = path.join(process.cwd(), 'data.json');

function getUsers(): UserProfile[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(users: UserProfile[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  const users = getUsers();

  if (username) {
    const user = users.find(u => u.username === username);
    if (user) {
      return NextResponse.json(user);
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(users);
}

export async function PUT(request: Request) {
  try {
    const updatedUser: UserProfile = await request.json();
    const users = getUsers();
    
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    saveUsers(users);

    return NextResponse.json({ message: 'User updated successfully', user: users[userIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
