import React from 'react';
import './Sponsors.css';

function EventDates() {
  return (
    <section className="sponsors-section" id="sponsors">
      <div className="container">
        <p className="subtitle">MARQUEZ VOS CALENDRIERS</p>
        <h2 className="main-title">
          <span className="first-letter">D</span>ATES DE L'ÉVÉNEMENT
        </h2>

        <div className="dates-grid">

          {/* Day 1 */}
          <div className="date-card">
            <div className="date-badge">JOUR 1</div>
            <div className="date-day">Jeudi</div>
            <div className="date-number">01</div>
            <div className="date-month">MAI 2026</div>
            <div className="date-divider" />
            <ul className="date-schedule">
              <li><span className="time">09:00</span> Cérémonie d'ouverture</li>
              <li><span className="time">10:00</span> Début du Tech for Hope</li>
              <li><span className="time">13:00</span> Pause Déjeuner</li>
              <li><span className="time">18:00</span> Sessions de Mentorat</li>
              <li><span className="time">22:00</span> Pointage de Minuit</li>
            </ul>
          </div>

          {/* Centre divider */}
          <div className="dates-versus">
            <div className="versus-line" />
            <div className="versus-circle">
              <span>48H</span>
            </div>
            <div className="versus-line" />
          </div>

          {/* Day 2 */}
          <div className="date-card date-card--end">
            <div className="date-badge">JOUR 2</div>
            <div className="date-day">Vendredi</div>
            <div className="date-number">02</div>
            <div className="date-month">MAI 2026</div>
            <div className="date-divider" />
            <ul className="date-schedule">
              <li><span className="time">08:00</span> Soumissions Finales</li>
              <li><span className="time">10:00</span> Démos des Projets</li>
              <li><span className="time">13:00</span> Délibération du Jury</li>
              <li><span className="time">15:00</span> Cérémonie de Remise des Prix</li>
              <li><span className="time">16:00</span> Clôture et Au revoir</li>
            </ul>
          </div>

        </div>


         {/* Location banner */}
        <div className="location-banner">
          <span className="location-icon">📍</span>
          <div className="location-info">
            <span className="location-label">Lieu</span>
            <span className="location-name">Agadir, Maroc</span>
          </div>
          <div className="location-dot" />
          <div className="location-info">
            <span className="location-label">Durée</span>
            <span className="location-name">48 Heures Non-stop</span>
          </div>
          <div className="location-dot" />
          <div className="location-info">
            <span className="location-label">Format</span>
            <span className="location-name">En présentiel uniquement</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default EventDates;