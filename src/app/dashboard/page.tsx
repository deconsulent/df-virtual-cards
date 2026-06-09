"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VirtualCard from '@/components/VirtualCard';
import { UserProfile } from '@/data/mockData';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedInUsername = localStorage.getItem('loggedInUser');
    if (!loggedInUsername) {
      router.push('/login');
      return;
    }

    // Fetch user from real API
    fetch(`/api/users?username=${loggedInUsername}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          localStorage.removeItem('loggedInUser');
          router.push('/login');
        } else {
          setUser(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading || !user) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setUser(prev => prev ? ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }) : null);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'skills' | 'certifications') => {
    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setUser(prev => prev ? ({ ...prev, [field]: arr }) : null);
  };

  const handleAddSchedule = () => {
    setUser(prev => prev ? {
      ...prev,
      schedule: [...(prev.schedule || []), { id: Date.now().toString(), days: [], startTime: '09:00', endTime: '17:00' }]
    } : null);
  };

  const handleRemoveSchedule = (id: string) => {
    setUser(prev => prev ? {
      ...prev,
      schedule: (prev.schedule || []).filter(s => s.id !== id)
    } : null);
  };

  const handleScheduleChange = (id: string, field: string, value: any) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = (prev.schedule || []).map(s => {
        if (s.id === id) {
          if (field === 'days') {
            const day = value as string;
            const newDays = s.days.includes(day) ? s.days.filter(d => d !== day) : [...s.days, day];
            return { ...s, days: newDays };
          }
          return { ...s, [field]: value };
        }
        return s;
      });
      return { ...prev, schedule: updated };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', user.username);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.avatarUrl) {
        setUser(prev => prev ? ({ ...prev, avatarUrl: data.avatarUrl }) : null);
        toast.success('Avatar uploaded successfully!');
      } else {
        toast.error('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Profile saved securely to the server!');
      } else {
        toast.error('Error saving: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Welcome, {user.name}</h1>
          <p style={{ color: '#cbd5e1' }}>Update your Design Factory virtual card in real-time.</p>
        </div>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Form Column */}
        <div style={{ flex: '1 1 400px' }}>
          
          {/* Analytics Section */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Profile Views Analytics (7 Days)</h2>
            <div style={{ height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={user.viewsHistory || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickFormatter={(tick) => tick.substring(5)} />
                  <YAxis stroke="#cbd5e1" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="count" stroke="#623cea" fill="url(#colorViews)" />
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#623cea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#623cea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={user.name} onChange={handleChange} className="form-control" />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <input type="text" name="role" value={user.role} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Profile Image (Upload)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="form-control" 
                style={{ padding: '8px' }}
                disabled={uploading}
              />
              {uploading && <span style={{ color: '#ffb300', fontSize: '0.9rem' }}>Uploading...</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Superpower</label>
            <textarea name="superpower" value={user.superpower} onChange={handleChange} className="form-control" rows={3}></textarea>
          </div>

          <div className="form-group">
            <label>Currently Building (Optional)</label>
            <input type="text" name="currentProject" value={user.currentProject} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Lab Certifications (Comma separated)</label>
            <input type="text" value={user.certifications.join(', ')} onChange={(e) => handleArrayChange(e, 'certifications')} className="form-control" />
          </div>

          <div className="form-group">
            <label>Skills (Comma separated)</label>
            <input type="text" value={user.skills.join(', ')} onChange={(e) => handleArrayChange(e, 'skills')} className="form-control" />
          </div>

          <div className="form-group">
            <label>Calendly / Booking Link</label>
            <input type="url" name="calendly" value={user.calendly} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Card Theme</label>
            <select name="theme" value={user.theme || 'default'} onChange={handleChange as any} className="form-control">
              <option value="default">DF Core (Dark Green)</option>
              <option value="midnight">Neon Prototyper</option>
              <option value="aurora">Industrial Slab</option>
              <option value="sunset">Creative Sunset</option>
              <option value="custom">Custom Colors</option>
            </select>
          </div>

          {user.theme === 'custom' && (
            <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>Color 1 (Top)</label>
                <input type="color" name="customColor1" value={user.customColor1 || '#141414'} onChange={handleChange} className="form-control" style={{ padding: '0', height: '40px', cursor: 'pointer' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Color 2 (Bottom)</label>
                <input type="color" name="customColor2" value={user.customColor2 || '#623cea'} onChange={handleChange} className="form-control" style={{ padding: '0', height: '40px', cursor: 'pointer' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Card Layout</label>
            <select name="layout" value={user.layout || 'vertical'} onChange={handleChange as any} className="form-control">
              <option value="vertical">Standard Vertical</option>
              <option value="horizontal">Sleek Horizontal</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" name="isAvailable" checked={user.isAvailable} onChange={handleChange} id="isAvailable" style={{ width: '20px', height: '20px' }} />
            <label htmlFor="isAvailable" style={{ margin: 0 }}>Available in the LAB (Green Dot)</label>
          </div>

          <div className="form-group" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
            <label style={{ marginBottom: '15px', display: 'block', fontWeight: 'bold' }}>Office Hours / Availability</label>
            
            {(user.schedule || []).map((s, index) => (
              <div key={s.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
                <button 
                  onClick={() => handleRemoveSchedule(s.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Remove
                </button>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>Days</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: s.days.includes(day) ? '#623cea' : 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', transition: 'background 0.2s' }}>
                        <input 
                          type="checkbox" 
                          checked={s.days.includes(day)}
                          onChange={() => handleScheduleChange(s.id, 'days', day)}
                          style={{ display: 'none' }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Start Time</label>
                    <input type="time" value={s.startTime} onChange={(e) => handleScheduleChange(s.id, 'startTime', e.target.value)} className="form-control" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>End Time</label>
                    <input type="time" value={s.endTime} onChange={(e) => handleScheduleChange(s.id, 'endTime', e.target.value)} className="form-control" />
                  </div>
                </div>
              </div>
            ))}

            <button onClick={handleAddSchedule} style={{ background: 'rgba(255,255,255,0.1)', border: '1px dashed rgba(255,255,255,0.3)', color: 'white', padding: '8px', width: '100%', borderRadius: '8px', cursor: 'pointer', marginTop: '5px' }}>
              + Add Schedule Row
            </button>
            
            {/* Legacy Fallback */}
            {(!user.schedule?.length && (user.officeDay || user.officeHours)) && (
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '10px' }}>Legacy formatting (will be hidden once you add a new schedule row above):</p>
                <div style={{ display: 'flex', gap: '10px', opacity: 0.5 }}>
                  <input type="text" value={user.officeDay || user.officeHours || ''} disabled className="form-control" />
                </div>
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={handleSave} style={{ marginTop: '20px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Preview Column */}
        <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#cbd5e1' }}>Live Preview</h2>
          <VirtualCard user={user} />
        </div>

      </div>
    </div>
  );
}
