import './Home.css'
import { Link } from "react-router-dom";
import techLogo from '../../assets/tech_for_hope_logo.jpg';


function Home() {
  return (
    <div className="home">


      {/* Content overlay */}
      <div className="content">
        <nav className="navbar">
          <div className="logo">Tech for Hope</div>
          <ul className="nav-links">
            <li><a href="#about" className="highlight">À propos</a></li>
            <li><a href="#tracks">Thèmes</a></li>
            <li><a href="#sponsors">Dates de l'événement</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>

        <div className="hero-wrapper">
          <div className="hero-text">
            {/* Mission pill */}
            <div className="mission-pill">
              <span className="mission-dot" />
              Technologie pour l'Inclusion
            </div>

            <h1>
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

            <Link to="/registrationForm" className="join-btn">
              <button>Rejoindre le Défi →</button>
            </Link>
          </div>

          <div className="hero-image-side">
            <img src={techLogo} alt="Tech for Hope" className="hero-logo-img" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
