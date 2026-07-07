import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function UserDashboard({ token }) {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login first to create a meeting.");
      return;
    }
    const loadingToast = toast.loading('Creating meeting...');
    try {
        const res = await axios.post('http://localhost:8000/meetings', {
            title: meetingTitle,
            description,
            attendees: [{ email: "test@example.com" }]
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success(`Meeting Created! Code: ${res.data.data.meetingCode}`, { id: loadingToast });
        setMeetingTitle('');
        setDescription('');
    } catch (err) {
        console.error(err);
        toast.error('Failed to create meeting', { id: loadingToast });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="glass" style={{ padding: '2rem' }}>
        <h2>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Welcome to your AI-powered meeting platform.</p>
        
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Upcoming Meetings</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Summaries</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</p>
          </div>
        </div>
      </section>

      <section className="glass" style={{ padding: '2rem' }}>
        <h2>Create a New Meeting</h2>
        <form onSubmit={handleCreateMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., Weekly Sync" 
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
            <textarea 
              className="input-field" 
              rows="4" 
              placeholder="What is this meeting about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Schedule Meeting</button>
        </form>
      </section>
    </div>
  );
}

export default UserDashboard;
