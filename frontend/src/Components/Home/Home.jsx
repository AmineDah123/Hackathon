import './Home.css';
import { Link } from "react-router-dom";
import img3 from '../../assets/img3.png';
import img1 from '../../assets/img1.png'; 

function Home() {
  return (
    <div className="home">
      {/* Background Glows bach tji tech vibe */}
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      <div className="content">
        <nav className="navbar">
          <div className="logo">
            <img src={img3} alt="Hackathon logo" />
          </div>

                  <ul className="nav-links">
            <li><a href="#about" className="highlight">À propos</a></li>
            <li><a href="#speakers" className="nav-item">Intervenantes</a></li>
            <li><a href="#tracks" className="nav-item">Thèmes</a></li>
            <li><a href="#sponsors" className="nav-item">Dates de l'événement</a></li>
            <li><a href="#faq" className="nav-item">FAQ</a></li>
            </ul>
                  </nav>

        <div className="hero-section">
          <div className="hero-left">
            <div className="mission-pill">
              <span className="mission-dot" />
                  Technologie pour l'Inclusion  
                  </div>

            <h1>
              <span className="first-letter">B</span>uild for<br />
              <span className="hero-accent">Tech for hope</span>
            </h1>

            <p className="hero-sub">
               Un hackathon dédié à la création de <strong>solutions technologiques pour les personnes handicapées</strong> —
                        mobilité, vision, audition, cognitif. Votre code peut changer la vie de quelqu'un.
             </p>

            <div className="hero-tags">
              <span className="hero-tag">♿ Accessibilité</span>
              <span className="hero-tag">🤖 IA & Tech d'Assistance</span>
              <span className="hero-tag">💡 Impact Réel</span>
            </div>

            <Link to="/registrationForm" className="join-btn-wrapper">
              <button className="join-btn1">Rejoindre le Défi →</button>
            </Link>
          </div>

          <div className="hero-right">
            {/* Hna t-qder t-dir image dyal robot awla design 3D */}
            <img src={img1} alt="Assistive Robot" className="floating-img" />
            <div className="stats-box">
              <span>+100</span>
              <p>Innovators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;