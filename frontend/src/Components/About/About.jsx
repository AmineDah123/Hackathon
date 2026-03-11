import './About.css'
import img1 from '../../assets/img2.png'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function About() {

  const [creativity, setCreativity] = useState(0);
  const [team, setTeam] = useState(0);
  const [ideas, setIdeas] = useState(0);

  useEffect(() => {

    let c = 0;
    let t = 0;
    let i = 0;

    const interval = setInterval(() => {

      if (c < 100) {
        c++;
        setCreativity(c);
      }

      if (t < 1) {
        t++;
        setTeam(t);
      }

      if (i < 577) {
        i += 5;
        setIdeas(i);
      }

      if (c >= 100 && t >= 1 && i >= 577) {
        clearInterval(interval);
      }

    }, 20);

  }, []);

  return (
    <>
<div id="about" className="about-section">
  <div className="about-container">

  <div className="about-text">

            <h2><span className="first-letter">À</span> propos de Tech for Hope</h2>

            <p>
              Rejoignez-nous pour un hackathon unique où la technologie se met au service de l'inclusion ! Que vous soyez développeur, designer ou passionné, cet événement de 48 heures est votre chance de créer des solutions innovantes pour relever les défis quotidiens des personnes en situation de handicap (mobilité, vision, audition, troubles cognitifs). Venez collaborer, concevoir des prototypes impactants et utiliser votre expertise pour faire une véritable différence dans la vie de ceux qui en ont le plus besoin.
            </p>

        
        
         <Link to="/registrationForm" className="join-btn-wrapper">
              <button className="join-btn1">Rejoindre le Défi →</button>
            </Link>                             


        <div className="hackathon-stats">

          <div className="stat">
            <h3>{creativity}%</h3>
            <span>Créativité</span>
          </div>

          <div className="stat">
            <h3>+{team}</h3>
            <span>Équipes</span>
          </div>

          <div className="stat">
            <h3>+{ideas}</h3>
            <span>Idées</span>
          </div>

        </div>

  </div>

  <div className="about-image">
     <img src={img1} alt="" />
  </div>

  </div>
</div>
</>
  )
}

export default About