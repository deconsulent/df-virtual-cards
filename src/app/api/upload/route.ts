import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const username = formData.get('username') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required to save avatar.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save with the username as filename
    const fileName = `${username}-${Date.now()}.png`; // Append timestamp to bypass cache
    const uploadDir = path.join(process.cwd(), 'public', 'avatars');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const avatarUrl = `/avatars/${fileName}`;

    return NextResponse.json({ message: 'Upload successful', avatarUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
