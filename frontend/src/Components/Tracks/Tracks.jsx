import React from 'react';

import './Tracks.css';
import { FaBrain, FaLeaf, FaCreditCard, FaShieldAlt, FaTruck, FaGraduationCap } from "react-icons/fa";
const trackData = [
  {
    id: 1,
    title: "AI EVOLUTION",
    icon: <FaBrain />,
    color: "blue",
    description: "Develop intelligent agents. Build AI solutions to optimize energy consumption or enhance education in Darija.",
  },
  {
    id: 2,
    title: "GREEN TECH",
    icon: <FaLeaf />,
    color: "green",
    description: "Build sustainable solutions. Innovate for water conservation and smart agriculture in rural Morocco.",
  },
  {
    id: 3,
    title: "FINTECH REVOLUTION",
    icon: <FaCreditCard />,
    color: "yellow",
    description: "Revolutionize digital payments. Design secure P2P lending platforms for Moroccan SMEs and underserved communities.",
  },
  {
    id: 4,
    title: "CYBERSECURITY GUARD",
    icon: <FaShieldAlt />,
    color: "red",
    description: "Fortify digital infrastructure. Create advanced systems to detect and prevent sophisticated phishing attacks.",
  },
  {
    id: 5,
    title: "SMART LOGISTICS",
    icon: <FaTruck />,
    color: "purple",
    description: "Optimize the supply chain. Use IoT and Data Science to solve delivery challenges in Moroccan cities and rural areas.",
  },
  {
    id: 6,
    title: "EDTECH INNOVATION",
    icon: <FaGraduationCap />,
    color: "pink",
    description: "Gamify learning. Create interactive platforms to help students master STEM subjects using localized content.",
  }
];

function Tracks() {
  return (
    <section className="tracks-section" id="tracks">
      <div className="container">
        <p className="main-title "><span className="first-letter">E</span>XPLORE THE TRACKS</p>
        <h2 className="subtitle">CHOOSE YOUR CHALLENGE</h2>
        
        <div className="tracks-grid">
          {trackData.map((track) => (
            <div key={track.id} className={`track-card card-${track.color}`}>
              <div className="card-header">
                {/* هنا يظهر icon ديال كل track */}
                <span className="track-icon">{track.icon}</span>
                <h3 className="track-title">{track.title}</h3>
              </div>
              <p className="track-desc">{track.description}</p>
              <div className="card-footer">
                <button className="learn-more">Learn More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Tracks;