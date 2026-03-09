import React from 'react';
import './Sponsors.css';

function EventDates() {
  return (
    <section className="sponsors-section" id="sponsors">
      <div className="container">
        <p className="subtitle">MARK YOUR CALENDAR</p>
        <h2 className="main-title">
          <span className="first-letter">E</span>VENT DATES
        </h2>

        <div className="dates-grid">

          {/* Day 1 */}
          <div className="date-card">
            <div className="date-badge">DAY 1</div>
            <div className="date-day">Thursday</div>
            <div className="date-number">01</div>
            <div className="date-month">MAY 2026</div>
            <div className="date-divider" />
            <ul className="date-schedule">
              <li><span className="time">09:00</span> Opening Ceremony</li>
              <li><span className="time">10:00</span> Hacking Begins</li>
              <li><span className="time">13:00</span> Lunch Break</li>
              <li><span className="time">18:00</span> Mentorship Sessions</li>
              <li><span className="time">22:00</span> Midnight Check-in</li>
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
            <div className="date-badge">DAY 2</div>
            <div className="date-day">Friday</div>
            <div className="date-number">02</div>
            <div className="date-month">MAY 2026</div>
            <div className="date-divider" />
            <ul className="date-schedule">
              <li><span className="time">08:00</span> Final Submissions</li>
              <li><span className="time">10:00</span> Project Demos</li>
              <li><span className="time">13:00</span> Jury Deliberation</li>
              <li><span className="time">15:00</span> Awards Ceremony</li>
              <li><span className="time">16:00</span> Closing & Farewell</li>
            </ul>
          </div>

        </div>

        {/* Location banner */}
        <div className="location-banner">
          <span className="location-icon">📍</span>
          <div className="location-info">
            <span className="location-label">Venue</span>
            <span className="location-name">Agadir, Morocco</span>
          </div>
          <div className="location-dot" />
          <div className="location-info">
            <span className="location-label">Duration</span>
            <span className="location-name">48 Hours Non-stop</span>
          </div>
          <div className="location-dot" />
          <div className="location-info">
            <span className="location-label">Format</span>
            <span className="location-name">In-Person Only</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default EventDates;