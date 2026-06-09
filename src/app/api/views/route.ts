import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Call our stored procedure to atomically increment the view and update history
    const { data, error } = await supabase.rpc('increment_view', { p_username: username });

    if (error) {
      console.error("View tracking error:", error);
      return NextResponse.json({ error: 'User not found or database error' }, { status: 404 });
    }

    return NextResponse.json({ success: true, views: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
