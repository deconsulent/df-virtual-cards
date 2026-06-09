import React from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { UserProfile } from '@/data/mockData';
import Directory from '@/components/Directory';

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

export default async function HomePage() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });

  let users: UserProfile[] = [];
  if (!error && data) {
    users = await Promise.all(data.map(formatUserRow));
  }

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
