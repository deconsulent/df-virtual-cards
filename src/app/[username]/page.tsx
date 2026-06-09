import React from 'react';
import VirtualCard from '@/components/VirtualCard';
import { notFound } from 'next/navigation';
import ViewTracker from '@/components/ViewTracker';
import { supabase } from '@/utils/supabase';
import { UserProfile } from '@/data/mockData';

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

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', resolvedParams.username)
    .single();

  if (error || !data) {
    notFound();
  }

  const user = await formatUserRow(data);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <ViewTracker username={user.username} />
      <VirtualCard user={user} />
    </div>
  );
}
