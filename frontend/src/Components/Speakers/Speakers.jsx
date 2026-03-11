import React from 'react';
import './Speakers.css';
import { FaLinkedin } from 'react-icons/fa'; // Install: npm install react-icons

const speakersData = [
  {
    id: 1,
    name: "Dr. Amine Benali",
    role: "Chercheur Senior en IA @ Google",
    topic: "L'Avenir des LLM en Afrique du Nord",
    image: "https://randomuser.me/api/portraits/men/32.jpg" // Replace with real photos
  },
  {
    id: 2,
    name: "Sara Mansouri",
    role: "Responsable Cybersécurité @ TechSafe",
    topic: "Construire des Infrastructures Numériques Résilientes",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Omar Kadiri",
    role: "Développeur Blockchain @ CryptoPay",
    topic: "Mettre à l'Échelle la FinTech avec le Web3",
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];

function Speakers() {
  return (
    <section className="speakers-section" id="speakers">
      <div className="container">
        <p className="main-title"><span className="first-letter">A</span>PPRENEZ DES MEILLEURS</p>
        <h2 className="subtitle">NOS INTERVENANTS INVITÉS</h2>
        
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