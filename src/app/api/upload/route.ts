import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

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

    // Convert file to array buffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const fileName = `${username}-${Date.now()}.png`;

    // Upload to Supabase Storage bucket named 'avatars'
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: 'Failed to upload to Supabase' }, { status: 500 });
    }

    // Get the public URL for the newly uploaded avatar
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = publicUrlData.publicUrl;

    return NextResponse.json({ message: 'Upload successful', avatarUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
