import './Home.css'
import { Link } from "react-router-dom";

import Spline from '@splinetool/react-spline';
function Home() {
  return (
    <div className="home">
      {/* Robot background */}
      <div className="spline-background">
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>

      {/* Content overlay */}
      <div className="content">
        <nav className="navbar">
          <div className="logo">Hackathon</div>
          <ul className="nav-links">
            <li><a href="#about" className="highlight">About</a></li>
            <li><a href="#speakers">Speakers</a></li>
            <li><a href="#trackes">Tracks</a></li>
            <li><a href="#sponsors">Sponsors</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>

        <div className="hero-text">
          {/* Mission pill */}
          <div className="mission-pill">
            <span className="mission-dot" />
            Technology for Inclusion
          </div>

          <h1>
            <span className="first-letter">B</span>uild for<br />
            <span className="hero-accent">Those Who Need It Most</span>
          </h1>

          <p className="hero-sub">
            A hackathon dedicated to creating <strong>tech solutions for people with disabilities</strong> —
            mobility, vision, hearing, cognitive. Your code can change someone's life.
          </p>

          <div className="hero-tags">
            <span className="hero-tag">♿ Accessibility</span>
            <span className="hero-tag">🤖 AI & Assistive Tech</span>
            <span className="hero-tag">💡 Real Impact</span>
          </div>

          <Link to="/registrationForm" className="join-btn">
            <button>Join the Challenge →</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home