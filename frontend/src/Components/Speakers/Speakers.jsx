import React from 'react';
import './Speakers.css';
import { FaLinkedin } from 'react-icons/fa'; // Install: npm install react-icons

const speakersData = [
  {
    id: 1,
    name: "Dr. Amine Benali",
    role: "Senior AI Researcher @ Google",
    topic: "The Future of LLMs in North Africa",
    image: "https://randomuser.me/api/portraits/men/32.jpg" // Replace with real photos
  },
  {
    id: 2,
    name: "Sara Mansouri",
    role: "Head of Cybersecurity @ TechSafe",
    topic: "Building Resilient Digital Infrastructures",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Omar Kadiri",
    role: "Blockchain Developer @ CryptoPay",
    topic: "Scaling FinTech with Web3",
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];

function Speakers() {
  return (
    <section className="speakers-section" id="speakers">
      <div className="container">
        <p className="main-title"><span className="first-letter">E</span>LEARN FROM THE BEST</p>
        <h2 className="subtitle">OUR GUEST SPEAKERS</h2>
        
        <div className="speakers-grid">
          {speakersData.map((speaker) => (
            <div key={speaker.id} className="speaker-card">
              <div className="image-container">
                <img src={speaker.image} alt={speaker.name} className="speaker-img" />
                <a href="#" className="linkedin-link"><FaLinkedin /></a>
              </div>
              <div className="speaker-info">
                <h3 className="speaker-name">{speaker.name}</h3>
                <p className="speaker-role">{speaker.role}</p>
                <div className="topic-badge">
                   <span>Topic:</span> {speaker.topic}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Speakers;