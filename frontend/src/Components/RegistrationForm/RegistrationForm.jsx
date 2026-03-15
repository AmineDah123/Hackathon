import React, { useState, useEffect } from 'react';
import './RegistrationForm.css';

const API = import.meta.env.VITE_API_URL || '/api';

function RegistrationForm() {
  // ── Server status ────────────────────────────────────────────────────────────
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');

  // ── Flow: 'group' | 'members' | 'thankyou' ──────────────────────────────────
  const [step, setStep] = useState('group');

  // ── Group info ───────────────────────────────────────────────────────────────
  const [groupName, setGroupName] = useState('');
  const [groupIdea, setGroupIdea] = useState('');
  const [groupId, setGroupId] = useState(null);

  // ── Member state ─────────────────────────────────────────────────────────────
  const [memberCount, setMemberCount] = useState(0);
  const [memberForm, setMemberForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', school: '', photo: null,
  });

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Fetch status on mount ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetch(`${API}/status`).then(r => r.json());
        setStatus(data);
      } catch {
        setStatusError('Impossible de joindre le serveur. Le backend est-il en cours d\'exécution ?');
      } finally {
        setStatusLoading(false);
      }
    })();
  }, []);

  const maxMembers = status?.maxMembers ?? 4;
  const totalGroups = status?.totalGroups ?? 0;

  // ── Restore from sessionStorage ──────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const savedGroupId = sessionStorage.getItem('groupId');
      const savedGroupName = sessionStorage.getItem('groupName');
      const savedGroupIdea = sessionStorage.getItem('groupIdea');
      
      if (savedGroupId && step === 'group') {
        setGroupId(savedGroupId);
        if (savedGroupName) setGroupName(savedGroupName);
        if (savedGroupIdea) setGroupIdea(savedGroupIdea);
        setStep('members');
        
        // Fetch current group member count from backend
        try {
          const res = await fetch(`${API}/groups/${savedGroupId}`);
          const data = await res.json();
          if (res.ok && data.group) {
            setMemberCount(data.group.members.length);
            if (data.group.members.length >= maxMembers) {
              setStep('thankyou');
              sessionStorage.clear();
            }
          } else {
            // Group not found anymore (deleted by admin or expired)
            sessionStorage.clear();
            setStep('group');
          }
        } catch (err) {
          console.error('Failed to restore member count', err);
        }
      }
    };
    restoreSession();
  }, [step, maxMembers]);

  // ── Step 1: Create group ─────────────────────────────────────────────────────
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to create group.'); return; }
      setGroupId(data.group.id);
      sessionStorage.setItem('groupId', data.group.id);
      sessionStorage.setItem('groupName', groupName.trim());
      sessionStorage.setItem('groupIdea', groupIdea.trim());
      setStatus(prev => ({ ...prev, totalGroups: (prev?.totalGroups ?? 0) + 1 }));
      setStep('members');
    } catch { setError('Network error. Is the backend running?'); }
    finally { setLoading(false); }
  };

  // ── Step 2: Add member ───────────────────────────────────────────────────────
  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const body = new FormData();
    body.append('firstName', memberForm.firstName);
    body.append('lastName', memberForm.lastName);
    body.append('email', memberForm.email);
    body.append('phone', memberForm.phone);
    body.append('school', memberForm.school);
    body.append('idea', groupIdea.trim());        // shared idea from Step 1
    if (memberForm.photo) {
      if (memberForm.photo.size > 100 * 1024) {
        setError('Le fichier est trop volumineux (Max 100 Ko).');
        setLoading(false);
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(memberForm.photo.type)) {
        setError('Format de fichier non autorisé (Uniquement JPG ou PDF).');
        setLoading(false);
        return;
      }
      body.append('photo', memberForm.photo);
    }

    try {
      const res = await fetch(`${API}/groups/${groupId}/members`, { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to add member.'); return; }

      const newCount = data.group.memberCount;
      setMemberCount(newCount);

      if (data.group.full) {
        // Refresh status then show thank-you
        const st = await fetch(`${API}/status`).then(r => r.json());
        setStatus(st);
        setStep('thankyou');
        sessionStorage.clear();
      }
      setMemberForm({ firstName: '', lastName: '', email: '', phone: '', school: '', photo: null });
      e.target.reset();
    } catch { setError('Network error. Is the backend running?'); }
    finally { setLoading(false); }
  };

  // ── Register another group ───────────────────────────────────────────────────
  const restart = () => {
    sessionStorage.clear();
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
        <p>Chargement…</p>
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
          <h2 className="main-titlee">Inscriptions Fermées</h2>
          <p className="subtitlee" style={{ fontSize: '0.9rem' }}>
            Les inscriptions sont closes. Rendez-vous au Tech for Hope !
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
          <h2 className="thankyou-title">Merci pour votre Inscription !</h2>
          <p className="thankyou-sub">
            Votre équipe a été inscrite avec succès au Tech for Hope.<br />
            Nous avons hâte de voir ce que vous allez accomplir !
          </p>
          <div className="thankyou-card">
            <span className="thankyou-label">Équipe</span>
            <span className="thankyou-team-name">{groupName}</span>
            <span className="thankyou-label" style={{ marginTop: 12 }}>Idée de Projet</span>
            <span className="thankyou-idea">{groupIdea}</span>
          </div>
          <div className="thankyou-badge">✓ Inscription Confirmée</div>
          {!status?.closed && (
            <button className="submit-btn" onClick={restart}>
              Inscrire une Autre Équipe
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
          <div className="reg-step-pill">Étape 1 sur 2</div>
          <h2 className="main-titlee">Créez Votre Équipe</h2>
          <p className="subtitlee">Équipe #{totalGroups + 1}</p>
        </div>

        <div className="step-container">
          <form className="hack-form" onSubmit={handleCreateGroup}>

            <div className="field-group">
              <label className="field-label">Nom de l'Équipe</label>
              <input
                type="text"
                placeholder="ex : CyberWarriors"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Idée de Projet</label>
              <p className="field-hint">Décrivez ce que votre équipe prévoit de construire. Cela sera partagé avec tous les membres.</p>
              <textarea
                placeholder="ex : Une application qui aide les utilisateurs malvoyants à naviguer..."
                required
                value={groupIdea}
                onChange={(e) => setGroupIdea(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Création en cours…' : 'Continuer — Ajouter des Membres →'}
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
          <div className="reg-step-pill">Étape 2 sur 2</div>
          <h2 className="main-titlee">Ajouter des Membres</h2>
        </div>

        {/* Group info banner */}
        <div className="group-banner">
          <div className="group-banner-left">
            <span className="group-banner-label">Équipe</span>
            <span className="group-banner-name">{groupName}</span>
          </div>
          <div className="group-banner-right">
            <span className="group-banner-label">Membre</span>
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
                <label className="field-label">Prénom</label>
                <input type="text" placeholder="Prénom" required
                  value={memberForm.firstName}
                  onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                  disabled={loading} />
              </div>
              <div className="field-group">
                <label className="field-label">Nom</label>
                <input type="text" placeholder="Nom" required
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
                <label className="field-label">Téléphone</label>
                <input type="tel" placeholder="+212 6XX XXX XXX" required
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  disabled={loading} />
              </div>
              <div className="field-group">
                <label className="field-label">École / Établissement</label>
                <input type="text" placeholder="ENSIAS, INPT…" required
                  value={memberForm.school}
                  onChange={(e) => setMemberForm({ ...memberForm, school: e.target.value })}
                  disabled={loading} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Photo de Profil</label>
              <p className="field-hint">⚠ Max 100 Ko — JPG ou PNG</p>
              <div className="file-drop">
                <input type="file" accept=".jpg,.jpeg,application/pdf" required
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 100 * 1024) {
                        setError('Le fichier est trop volumineux (Max 100 Ko).');
                        setMemberForm({ ...memberForm, photo: null });
                        e.target.value = ''; // Reset input
                      } else {
                        setError('');
                        setMemberForm({ ...memberForm, photo: file });
                      }
                    } else {
                      setMemberForm({ ...memberForm, photo: null });
                    }
                  }}
                  disabled={loading} />
                <span className="file-drop-text">
                  {memberForm.photo ? `📎 ${memberForm.photo.name}` : '📁 Cliquez pour télécharger une photo'}
                </span>
              </div>
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? 'Enregistrement…'
                : memberCount + 1 === maxMembers
                  ? '🎉 Soumettre et Terminer l\'Équipe'
                  : `Enregistrer le Membre ${memberCount + 1} →`}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegistrationForm;