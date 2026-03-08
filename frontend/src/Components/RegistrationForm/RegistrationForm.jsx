import React, { useState, useEffect } from 'react';
import './RegistrationForm.css';

const API = '/api';

function RegistrationForm() {
  // ── Status ──────────────────────────────────────────────────────────────────
  const [status, setStatus]         = useState(null);   // { totalGroups, maxGroups, maxMembers, closed, groups }
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError]     = useState('');

  // ── Group creation ───────────────────────────────────────────────────────────
  const [currentGroupName, setCurrentGroupName] = useState('');
  const [currentGroupId,   setCurrentGroupId]   = useState(null);
  const [isGroupCreated,   setIsGroupCreated]   = useState(false);

  // ── Member tracking ──────────────────────────────────────────────────────────
  const [memberCount, setMemberCount] = useState(0);   // how many members added so far for current group

  // ── Member form ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', school: '', idea: '', photo: null,
  });

  // ── UI states ─────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // ── Fetch registration status on mount ───────────────────────────────────────
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res  = await fetch(`${API}/status`);
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        setStatusError('Could not reach the server. Is the backend running?');
      } finally {
        setStatusLoading(false);
      }
    };
    fetchStatus();
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const maxMembers = status?.maxMembers ?? 4;
  const maxGroups  = status?.maxGroups  ?? 4;
  const totalGroups = status?.totalGroups ?? 0;

  // ── Step 1: Create group (POST /api/groups) ──────────────────────────────────
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!currentGroupName.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res  = await fetch(`${API}/groups`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: currentGroupName.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create group.');
        return;
      }

      setCurrentGroupId(data.group.id);
      setIsGroupCreated(true);
      // Optimistically update total count
      setStatus(prev => ({ ...prev, totalGroups: (prev?.totalGroups ?? 0) + 1 }));
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Add member (POST /api/groups/:id/members) ────────────────────────
  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Build multipart/form-data (required for photo upload)
    const body = new FormData();
    body.append('firstName', formData.firstName);
    body.append('lastName',  formData.lastName);
    body.append('email',     formData.email);
    body.append('phone',     formData.phone);
    body.append('school',    formData.school);
    body.append('idea',      formData.idea);
    if (formData.photo) body.append('photo', formData.photo);

    try {
      const res  = await fetch(`${API}/groups/${currentGroupId}/members`, {
        method: 'POST',
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to add member.');
        return;
      }

      const newCount = data.group.memberCount;
      setMemberCount(newCount);

      if (data.group.full) {
        // Group is full — reset for next group
        alert(data.message);
        setMemberCount(0);
        setCurrentGroupName('');
        setCurrentGroupId(null);
        setIsGroupCreated(false);

        // Refresh status from server to get accurate group list
        const statusRes  = await fetch(`${API}/status`);
        const statusData = await statusRes.json();
        setStatus(statusData);
      }

      // Reset member form
      setFormData({ firstName: '', lastName: '', email: '', phone: '', school: '', idea: '', photo: null });
      e.target.reset();
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ── Render: loading / error states ───────────────────────────────────────────
  if (statusLoading) {
    return (
      <section className="reg-section">
        <div className="containere">
          <p className="subtitlee" style={{ textAlign: 'center', padding: '3rem' }}>
            ⏳ Loading registration status…
          </p>
        </div>
      </section>
    );
  }

  if (statusError) {
    return (
      <section className="reg-section">
        <div className="containere">
          <p className="subtitlee" style={{ textAlign: 'center', color: '#ff4d4d', padding: '3rem' }}>
            ⚠️ {statusError}
          </p>
        </div>
      </section>
    );
  }

  // ── Render: registration closed ───────────────────────────────────────────────
  if (status?.closed) {
    return (
      <div className="closed-status">
        <h2 className="main-titlee">🚫 REGISTRATION CLOSED</h2>
        <p className="subtitlee">All {maxGroups} groups are registered. See you there!</p>
      </div>
    );
  }

  // ── Render: main form ─────────────────────────────────────────────────────────
  return (
    <section className="reg-section">
      <div className="containere">
        <p className="subtitlee">HACKATHON REGISTRATION</p>
        <h2 className="main-titlee">GROUP {totalGroups + 1} / {maxGroups}</h2>

        {!isGroupCreated ? (
          /* FORM 1: Group Name */
          <div className="step-container">
            <form className="hack-form" onSubmit={handleCreateGroup}>
              <h3>Step 1: Create Your Group</h3>
              <p className="instruction-text">Enter a unique name for your team to start adding members.</p>

              <input
                type="text"
                placeholder="Team Name (e.g. CyberWarriors)"
                required
                value={currentGroupName}
                onChange={(e) => setCurrentGroupName(e.target.value)}
                disabled={loading}
              />

              {error && <p style={{ color: '#ff4d4d', marginTop: '0.5rem', fontSize: '0.9rem' }}>⚠️ {error}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'CREATING…' : 'START ADDING MEMBERS'}
              </button>
            </form>
          </div>
        ) : (
          /* FORM 2: Member Registration */
          <div className="step-container">
            <div className="group-header-info">
              <h3>Team: <span>{currentGroupName}</span></h3>
              <p>Registering Member {memberCount + 1} of {maxMembers}</p>
            </div>

            <form className="hack-form" onSubmit={handleAddMember}>
              <div className="input-group-row">
                <input
                  type="text" placeholder="First Name" required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={loading}
                />
                <input
                  type="text" placeholder="Last Name" required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={loading}
                />
              </div>

              <input
                type="email" placeholder="Email Address" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />

              <input
                type="tel" placeholder="Phone Number" required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />

              <input
                type="text" placeholder="Establishment" required
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                disabled={loading}
              />

              <div className="file-upload">
                <label>Profile Photo</label>
                <input
                  type="file" accept="image/*" required
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                  disabled={loading}
                />
              </div>

              <textarea
                placeholder="Your Project Idea…" required
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                disabled={loading}
              />

              {error && <p style={{ color: '#ff4d4d', marginTop: '0.5rem', fontSize: '0.9rem' }}>⚠️ {error}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'SAVING…' : `ADD MEMBER ${memberCount + 1}`}
              </button>
            </form>

            <div className="progress-dots">
              {[...Array(maxMembers)].map((_, i) => (
                <div key={i} className={`dot ${i < memberCount ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RegistrationForm;