import React from 'react';
import './Contact.css';
import { FaEnvelope, FaMapMarkerAlt, FaDiscord, FaInstagram } from 'react-icons/fa';

function Contact() {
  return (
    <section className="contact-section">
      <div className="container">
        <p className="subtitlee">GET IN TOUCH</p>
        <h2 className="main-titlee">CONTACT US</h2>

        <div className="contact-wrapper">
          {/* Form Side */}
          <div className="contact-form-card">
            <form>
              <div className="input-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="input-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="input-group">
                <select required>
                  <option value="">Subject</option>
                  <option value="participant">Participant Query</option>
                  <option value="sponsor">Sponsorship</option>
                  <option value="mentor">Mentorship</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <textarea placeholder="How can we help you?" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">SEND MESSAGE</button>
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
                <h4>Community</h4>
                <p>Join our Discord Server</p>
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