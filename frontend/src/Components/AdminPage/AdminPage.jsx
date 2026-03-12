import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const API = '/api';

function AdminPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API}/groups`);
      const data = await res.json();
      if (!res.ok) throw new Error('Erreur lors de la récupération');
      setGroups(data.groups || []);
    } catch (err) {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loader">Chargement des données...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Dashboard Admin — <span className="highlight">Tech for Hope</span></h1>
        <div className="stats-summary">
          <span>Total Équipes: <strong>{groups.length}</strong></span>
        </div>
      </header>

      {error && <div className="admin-error">{error}</div>}

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <div className="group-card-header">
              <h3>{group.name}</h3>
              <span className={`status-badge ${group.full ? 'full' : 'pending'}`}>
                {group.memberCount} Membres
              </span>
            </div>
            
            <p className="group-project-idea">
              <strong>Projet:</strong> {group.idea || "Aucune idée fournie"}
            </p>

            <div className="members-list">
              <h4>Membres :</h4>
              {group.members && group.members.map((m, idx) => (
                <div key={idx} className="member-item">
                  {m.photo && <img src={`${API}/uploads/${m.photo}`} alt="profil" className="member-avatar" />}
                  <div className="member-info">
                    <p className="m-name">{m.firstName} {m.lastName}</p>
                    <p className="m-school">{m.school}</p>
                    <p className="m-contact">{m.email} | {m.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;