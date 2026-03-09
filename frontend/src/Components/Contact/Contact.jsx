import React from 'react';
import './Contact.css';
import { FaEnvelope, FaMapMarkerAlt, FaDiscord, FaInstagram } from 'react-icons/fa';

function Contact() {
  return (
    <section className="contact-section">
      <div className="container">
        <p className="subtitlee">PRENEZ CONTACT</p>
        <h2 className="main-titlee">CONTACTEZ-NOUS</h2>

        <div className="contact-wrapper">
          {/* Form Side */}
          <div className="contact-form-card">
            <form>
              <div className="input-group">
                <input type="text" placeholder="Votre Nom" required />
              </div>
              <div className="input-group">
                <input type="email" placeholder="Votre Email" required />
              </div>
              <div className="input-group">
                <select required>
                  <option value="">Sujet</option>
                  <option value="participant">Question de Participant</option>
                  <option value="sponsor">Sponsoring</option>
                  <option value="mentor">Mentorat</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div className="input-group">
                <textarea placeholder="Comment pouvons-nous vous aider ?" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">ENVOYER LE MESSAGE</button>
            </form>
          </div>

          {/* Info Side */}
          <div className="contact-info-card">
            <div className="info-item">
              <FaEnvelope className="icon" />
              <div>
                <h4>Email</h4>
                <p>hello@db3ndna.com</p>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h4>Location</h4>
                <p>Technopark, Casablanca, Morocco</p>
              </div>
            </div>
            <div className="info-item">
              <FaDiscord className="icon" />
              <div>
                <h4>Communauté</h4>
                <p>Rejoignez notre serveur Discord</p>
              </div>
            </div>
            <div className="social-links-row">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaDiscord /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;