import React, { useState } from 'react';
import './RegistrationForm.css';

function RegistrationForm() {
  const [groups, setGroups] = useState([]); // Database sghira d l-groups
  const [currentGroupName, setCurrentGroupName] = useState(''); // Smiya d l-group li khdam
  const [isGroupCreated, setIsGroupCreated] = useState(false); // Wach l-smiya t-3tat
  const [members, setMembers] = useState([]); // Members dyal l-group l-7ali
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', school: '', idea: '', photo: null
  });

  const maxMembers = 4;
  const maxGroups = 4;

  // Step 1: Create Group Name
  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (currentGroupName.trim() !== "") {
      setIsGroupCreated(true);
    }
  };

  // Step 2: Add Member
  const handleAddMember = (e) => {
    e.preventDefault();
    const newMember = { ...formData, id: Date.now() };
    const updatedMembers = [...members, newMember];

    if (updatedMembers.length === maxMembers) {
      alert(`🎉 Group "${currentGroupName}" is now FULL!`);
      setGroups([...groups, { name: currentGroupName, members: updatedMembers }]);
      
      // Reset for NEXT group
      setMembers([]);
      setCurrentGroupName('');
      setIsGroupCreated(false);
    } else {
      setMembers(updatedMembers);
    }

    // Reset member form
    setFormData({ firstName: '', lastName: '', email: '', phone: '', school: '', idea: '', photo: null });
    e.target.reset();
  };

  if (groups.length >= maxGroups) {
    return (
      <div className="closed-status">
        <h2 className="main-titlee">🚫 REGISTRATION CLOSED</h2>
        <p className="subtitlee">All {maxGroups} groups are registered. See you there!</p>
      </div>
    );
  }

  return (
    <section className="reg-section">
      <div className="containere">
        <p className="subtitlee">HACKATHON REGISTRATION</p>
        <h2 className="main-titlee">GROUP {groups.length + 1} / {maxGroups}</h2>

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
              />
              <button type="submit" className="submit-btn">START ADDING MEMBERS</button>
            </form>
          </div>
        ) : (
          /* FORM 2: Members Registration */
          <div className="step-container">
            <div className="group-header-info">
              <h3>Team: <span>{currentGroupName}</span></h3>
              <p>Registering Member {members.length + 1} of 4</p>
            </div>

            <form className="hack-form" onSubmit={handleAddMember}>
              <div className="input-group-row">
                <input type="text" placeholder="First Name" required 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <input type="text" placeholder="Last Name" required 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>

              <input type="email" placeholder="Email Address" required 
                onChange={(e) => setFormData({...formData, email: e.target.value})} />

              <input type="tel" placeholder="Phone Number" required 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />

              <input type="text" placeholder="Establishment" required 
                onChange={(e) => setFormData({...formData, school: e.target.value})} />

              <div className="file-upload">
                <label>Profile Photo</label>
                <input type="file" accept="image/*" required 
                  onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} />
              </div>

              <textarea placeholder="Your Project Idea..." required
                onChange={(e) => setFormData({...formData, idea: e.target.value})}></textarea>

              <button type="submit" className="submit-btn">
                ADD MEMBER {members.length + 1}
              </button>
            </form>

            <div className="progress-dots">
              {[...Array(maxMembers)].map((_, i) => (
                <div key={i} className={`dot ${i < members.length ? 'active' : ''}`}></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RegistrationForm;