import React from 'react';

import './Tracks.css';
import { FaWheelchair, FaEye, FaDeaf, FaBrain, FaRobot, FaUniversalAccess } from "react-icons/fa";
const trackData = [
  {
    id: 1,
    title: "MOBILITÉ",
    icon: <FaWheelchair />,
    color: "blue",
    description: "Créez des solutions matérielles ou logicielles pour améliorer la liberté de mouvement et l'accès aux espaces physiques pour les personnes à mobilité réduite.",
  },
  {
    id: 2,
    title: "VISION",
    icon: <FaEye />,
    color: "green",
    description: "Développez des outils d'assistance visuelle, de reconnaissance d'objets par IA ou des systèmes de navigation pour les personnes aveugles ou malvoyantes.",
  },
  {
    id: 3,
    title: "AUDITION",
    icon: <FaDeaf />,
    color: "yellow",
    description: "Concevez des applications de transcription vocale en temps réel, de traduction en langue des signes ou de systèmes d'alertes visuelles/vibratoires.",
  },
  {
    id: 4,
    title: "COGNITIF",
    icon: <FaBrain />,
    color: "red",
    description: "Aidez les personnes neurodivergentes ou ayant des troubles d'apprentissage avec des outils d'organisation, de concentration ou d'éducation adaptée.",
  },
  {
    id: 5,
    title: "VIE QUOTIDIENNE",
    icon: <FaRobot />,
    color: "purple",
    description: "Utilisez la domotique, les objets connectés (IoT) et la robotique pour automatiser les tâches et encourager l'indépendance à domicile.",
  },
  {
    id: 6,
    title: "ACCESSIBILITÉ NUMÉRIQUE",
    icon: <FaUniversalAccess />,
    color: "pink",
    description: "Repensez l'accès à l'information et aux services en ligne en créant des interfaces web et mobiles véritablement universelles et inclusives.",
  }
];

function Tracks() {
  return (
    <section className="tracks-section" id="tracks">
      <div className="container">
        <p className="main-title "><span className="first-letter">E</span>XPLOREZ LES THÈMES</p>
        <h2 className="subtitle">CHOISISSEZ VOTRE DÉFI</h2>

        <div className="tracks-grid">
          {trackData.map((track) => (
            <div key={track.id} className={`track-card card-${track.color}`}>
              <div className="card-header">
                {/* هنا يظهر icon ديال كل track */}
                <span className="track-icon">{track.icon}</span>
                <h3 className="track-title">{track.title}</h3>
              </div>
              <p className="track-desc">{track.description}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Tracks;