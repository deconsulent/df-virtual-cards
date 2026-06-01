"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VirtualCard from '@/components/VirtualCard';
import { UserProfile } from '@/data/mockData';

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
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed.');
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
        alert('Profile saved securely to the server!');
      } else {
        alert('Error saving: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error saving profile.');
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

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" name="isAvailable" checked={user.isAvailable} onChange={handleChange} id="isAvailable" style={{ width: '20px', height: '20px' }} />
            <label htmlFor="isAvailable" style={{ margin: 0 }}>Available in the LAB (Green Dot)</label>
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
