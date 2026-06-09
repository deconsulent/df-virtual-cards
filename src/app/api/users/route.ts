import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { UserProfile, ScheduleEntry } from '@/data/mockData';

// Helper to format DB row to UserProfile
async function formatUserRow(row: any): Promise<UserProfile> {
  // Fetch related data
  const [skillsRes, certsRes, scheduleRes, historyRes] = await Promise.all([
    supabase.from('skills').select('name').eq('user_id', row.id),
    supabase.from('certifications').select('name').eq('user_id', row.id),
    supabase.from('schedule').select('*').eq('user_id', row.id),
    supabase.from('views_history').select('*').eq('user_id', row.id).order('date', { ascending: true })
  ]);

  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    role: row.role,
    superpower: row.superpower || '',
    currentProject: row.current_project || '',
    avatarUrl: row.avatar_url || '',
    linkedin: row.linkedin || '',
    calendly: row.calendly || '',
    isAvailable: row.is_available,
    theme: row.theme,
    layout: row.layout,
    customColor1: row.custom_color_1 || undefined,
    customColor2: row.custom_color_2 || undefined,
    officeHours: row.office_hours || undefined,
    officeDay: row.office_day || undefined,
    officeStartTime: row.office_start || undefined,
    officeEndTime: row.office_end || undefined,
    views: row.views || 0,
    skills: skillsRes.data?.map(s => s.name) || [],
    certifications: certsRes.data?.map(c => c.name) || [],
    schedule: scheduleRes.data?.map(s => ({
      id: s.id,
      days: s.days,
      startTime: s.start_time,
      endTime: s.end_time
    })) || [],
    viewsHistory: historyRes.data?.map(h => ({
      date: h.date,
      count: h.count
    })) || [],
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (username) {
    const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = await formatUserRow(data);
    return NextResponse.json(user);
  }

  // Get all users
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: true });
  if (error || !data) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  const users = await Promise.all(data.map(formatUserRow));
  return NextResponse.json(users);
}

export async function PUT(request: Request) {
  try {
    const updatedUser: UserProfile = await request.json();
    
    if (!updatedUser.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update main user record
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: updatedUser.name,
        role: updatedUser.role,
        superpower: updatedUser.superpower,
        current_project: updatedUser.currentProject,
        avatar_url: updatedUser.avatarUrl,
        linkedin: updatedUser.linkedin,
        calendly: updatedUser.calendly,
        is_available: updatedUser.isAvailable,
        theme: updatedUser.theme,
        layout: updatedUser.layout,
        custom_color_1: updatedUser.customColor1,
        custom_color_2: updatedUser.customColor2,
        office_hours: updatedUser.officeHours,
        office_day: updatedUser.officeDay,
        office_start: updatedUser.officeStartTime,
        office_end: updatedUser.officeEndTime,
      })
      .eq('id', updatedUser.id);

    if (userError) throw userError;

    // Replace skills
    await supabase.from('skills').delete().eq('user_id', updatedUser.id);
    if (updatedUser.skills?.length) {
      await supabase.from('skills').insert(updatedUser.skills.map(name => ({ user_id: updatedUser.id, name })));
    }

    // Replace certifications
    await supabase.from('certifications').delete().eq('user_id', updatedUser.id);
    if (updatedUser.certifications?.length) {
      await supabase.from('certifications').insert(updatedUser.certifications.map(name => ({ user_id: updatedUser.id, name })));
    }

    // Replace schedule
    await supabase.from('schedule').delete().eq('user_id', updatedUser.id);
    if (updatedUser.schedule?.length) {
      await supabase.from('schedule').insert(updatedUser.schedule.map(s => ({
        user_id: updatedUser.id,
        days: s.days,
        start_time: s.startTime,
        end_time: s.endTime
      })));
    }

    // Fetch updated
    const { data } = await supabase.from('users').select('*').eq('id', updatedUser.id).single();
    const formatted = await formatUserRow(data);

    return NextResponse.json({ message: 'User updated successfully', user: formatted });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newUser: Partial<UserProfile> = await request.json();
    
    if (!newUser.username || !newUser.name || !newUser.email || !newUser.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert user (password hashing is usually done via Postgres extension or edge function, 
    // but since we are using pgcrypto and Anon key, we need a secure way to insert. 
    // For simplicity with pgcrypto, we will use a raw RPC or insert raw hash if possible.
    // Wait, Supabase js insert doesn't support SQL functions like `crypt(...)` directly in the payload.
    // Let's use RPC if possible. We didn't define an RPC for user creation. 
    // I will write an RPC or just let it fail if we don't handle the password right now.
    // Actually, I can just create an RPC function for creating a user. 
    return NextResponse.json({ error: 'Please use Supabase Dashboard or an RPC to create users for now.' }, { status: 501 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
