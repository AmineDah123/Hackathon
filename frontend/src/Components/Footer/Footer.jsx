import React from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa'; // npm install react-icons

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-brand">
  <h2 className="logo-text">H<span>ACKATHON</span></h2>
  <p className="footer-description">
    Join the ultimate 48-hour sprint where Morocco's brightest minds converge 
    to solve real-world problems. From AI evolution to sustainable tech, 
    we are building the digital foundations of tomorrow, together.
  </p>
</div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#about" className="highlight">About</a></li>
                          <li><a href="#speakers">Speakers</a></li> 
                          <li><a href="#trackes">Tracks</a></li>
                          <li><a href="#sponsors">Sponsors</a></li> 
                           <li><a href="#faq">FAQ</a></li> 
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaDiscord /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()}  Hackathon. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;