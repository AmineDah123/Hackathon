import React, { useState, useEffect } from 'react';
import './RegistrationForm.css';

const API = '/api';

function RegistrationForm() {
  // ── Server status ────────────────────────────────────────────────────────────
  const [status,        setStatus]        = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError,   setStatusError]   = useState('');

  // ── Flow: 'group' | 'members' | 'thankyou' ──────────────────────────────────
  const [step, setStep] = useState('group');

  // ── Group info ───────────────────────────────────────────────────────────────
  const [groupName, setGroupName] = useState('');
  const [groupIdea, setGroupIdea] = useState('');
  const [groupId,   setGroupId]   = useState(null);

  // ── Member state ─────────────────────────────────────────────────────────────
  const [memberCount, setMemberCount] = useState(0);
  const [memberForm,  setMemberForm]  = useState({
    firstName: '', lastName: '', email: '', phone: '', school: '', photo: null,
  });

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // ── Fetch status on mount ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetch(`${API}/status`).then(r => r.json());
        setStatus(data);
      } catch {
        setStatusError('Could not reach the server. Is the backend running?');
      } finally {
        setStatusLoading(false);
      }
    })();
  }, []);

  const maxMembers  = status?.maxMembers  ?? 4;
  const maxGroups   = status?.maxGroups   ?? 4;
  const totalGroups = status?.totalGroups ?? 0;

  // ── Step 1: Create group ─────────────────────────────────────────────────────
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${API}/groups`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: groupName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to create group.'); return; }
      setGroupId(data.group.id);
      setStatus(prev => ({ ...prev, totalGroups: (prev?.totalGroups ?? 0) + 1 }));
      setStep('members');
    } catch { setError('Network error. Is the backend running?'); }
    finally  { setLoading(false); }
  };

  // ── Step 2: Add member ───────────────────────────────────────────────────────
  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const body = new FormData();
    body.append('firstName', memberForm.firstName);
    body.append('lastName',  memberForm.lastName);
    body.append('email',     memberForm.email);
    body.append('phone',     memberForm.phone);
    body.append('school',    memberForm.school);
    body.append('idea',      groupIdea.trim());        // shared idea from Step 1
    if (memberForm.photo) body.append('photo', memberForm.photo);

    try {
      const res  = await fetch(`${API}/groups/${groupId}/members`, { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to add member.'); return; }

      const newCount = data.group.memberCount;
      setMemberCount(newCount);

      if (data.group.full) {
        // Refresh status then show thank-you
        const st = await fetch(`${API}/status`).then(r => r.json());
        setStatus(st);
        setStep('thankyou');
      }
      setMemberForm({ firstName: '', lastName: '', email: '', phone: '', school: '', photo: null });
      e.target.reset();
    } catch { setError('Network error. Is the backend running?'); }
    finally  { setLoading(false); }
  };

  // ── Register another group ───────────────────────────────────────────────────
  const restart = () => {
    setGroupName(''); setGroupIdea(''); setGroupId(null);
    setMemberCount(0); setError(''); setStep('group');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SHELL: loading / error / closed
  // ─────────────────────────────────────────────────────────────────────────────
  if (statusLoading) return (
    <section className="reg-section">
      <div className="reg-loader">
        <div className="loader-ring" />
        <p>Loading…</p>
      </div>
    </section>
  );

  if (statusError) return (
    <section className="reg-section">
      <div className="containere">
        <div className="form-error">⚠️ {statusError}</div>
      </div>
    </section>
  );

  if (status?.closed) return (
    <section className="reg-section">
      <div className="containere">
        <div className="closed-status">
          <span className="closed-icon">🔒</span>
          <h2 className="main-titlee">Registration Closed</h2>
          <p className="subtitlee" style={{ fontSize: '0.9rem' }}>
            All {maxGroups} groups are registered. See you at the Hackathon!
          </p>
        </div>
      </div>
    </section>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // THANK-YOU
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'thankyou') return (
    <section className="reg-section">
      <div className="containere">
        <div className="thankyou-wrapper">
          <div className="thankyou-icon">🎉</div>
          <h2 className="thankyou-title">Thank You for Registering!</h2>
          <p className="thankyou-sub">
            Your team has been successfully enrolled in the Hackathon.<br />
            We can't wait to see what you build!
          </p>
          <div className="thankyou-card">
            <span className="thankyou-label">Team</span>
            <span className="thankyou-team-name">{groupName}</span>
            <span className="thankyou-label" style={{ marginTop: 12 }}>Project Idea</span>
            <span className="thankyou-idea">{groupIdea}</span>
          </div>
          <div className="thankyou-badge">✓ Registration Confirmed</div>
          {!status?.closed && (
            <button className="submit-btn" onClick={restart}>
              Register Another Group
            </button>
          )}
        </div>
      </div>
    </section>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1 — Group name + idea
  // ─────────────────────────────────────────────────────────────────────────────
  if (step === 'group') return (
    <section className="reg-section">
      <div className="containere">
        <div className="reg-header">
          <div className="reg-step-pill">Step 1 of 2</div>
          <h2 className="main-titlee">Create Your Group</h2>
          <p className="subtitlee">Slot {totalGroups + 1} of {maxGroups} remaining</p>
        </div>

        <div className="step-container">
          <form className="hack-form" onSubmit={handleCreateGroup}>

            <div className="field-group">
              <label className="field-label">Team Name</label>
              <input
                type="text"
                placeholder="e.g. CyberWarriors"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Project Idea</label>
              <p className="field-hint">Describe what your team plans to build. This will be shared across all members.</p>
              <textarea
                placeholder="e.g. An app that helps visually impaired users navigate public spaces independently…"
                required
                value={groupIdea}
                onChange={(e) => setGroupIdea(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating…' : 'Continue — Add Members →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2 — Add members
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <section className="reg-section">
      <div className="containere">
        <div className="reg-header">
          <div className="reg-step-pill">Step 2 of 2</div>
          <h2 className="main-titlee">Add Members</h2>
        </div>

        {/* Group info banner */}
        <div className="group-banner">
          <div className="group-banner-left">
            <span className="group-banner-label">Team</span>
            <span className="group-banner-name">{groupName}</span>
          </div>
          <div className="group-banner-right">
            <span className="group-banner-label">Member</span>
            <span className="group-banner-count">{memberCount + 1} <span style={{ color: '#475569' }}>/ {maxMembers}</span></span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          {[...Array(maxMembers)].map((_, i) => (
            <div key={i} className={`progress-seg ${i < memberCount ? 'done' : ''}`} />
          ))}
        </div>

        <div className="step-container">
          <form className="hack-form" onSubmit={handleAddMember}>
            <div className="input-group-row">
              <div className="field-group">
                <label className="field-label">First Name</label>
                <input type="text" placeholder="First Name" required
                  value={memberForm.firstName}
                  onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                  disabled={loading} />
              </div>
              <div className="field-group">
                <label className="field-label">Last Name</label>
                <input type="text" placeholder="Last Name" required
                  value={memberForm.lastName}
                  onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                  disabled={loading} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input type="email" placeholder="amine@example.com" required
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                disabled={loading} />
            </div>

            <div className="input-group-row">
              <div className="field-group">
                <label className="field-label">Phone</label>
                <input type="tel" placeholder="+212 6XX XXX XXX" required
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  disabled={loading} />
              </div>
              <div className="field-group">
                <label className="field-label">School / Establishment</label>
                <input type="text" placeholder="ENSIAS, INPT…" required
                  value={memberForm.school}
                  onChange={(e) => setMemberForm({ ...memberForm, school: e.target.value })}
                  disabled={loading} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Profile Photo</label>
              <p className="field-hint">⚠ Max 100 KB — JPG or PNG</p>
              <div className="file-drop">
                <input type="file" accept="image/*" required
                  onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.files[0] })}
                  disabled={loading} />
                <span className="file-drop-text">
                  {memberForm.photo ? `📎 ${memberForm.photo.name}` : '📁 Click to upload photo'}
                </span>
              </div>
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? 'Saving…'
                : memberCount + 1 === maxMembers
                  ? '🎉 Submit & Complete Group'
                  : `Save Member ${memberCount + 1} →`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegistrationForm;