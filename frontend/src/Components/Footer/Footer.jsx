import React from 'react';
import './Footer.css';


function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-brand">
            <h2 className="logo-text">H<span>ACKATHON</span></h2>
            <p className="footer-description">
              Rejoignez le sprint ultime de 48 heures où les esprits les plus brillants du Maroc se réunissent
              pour résoudre des problèmes concrets. De l'évolution de l'IA aux technologies durables,
              nous construisons ensemble les fondations numériques de demain.
            </p>
          </div>
        </div>

        <div className="footer-links">
          <h4>Liens Rapides</h4>
          <ul>
            <li><a href="#about" className="highlight">À propos</a></li>
            <li><a href="#tracks">Thèmes</a></li>
            <li><a href="#sponsors">Dates de l'événement</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>


      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()}  Hackathon. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;