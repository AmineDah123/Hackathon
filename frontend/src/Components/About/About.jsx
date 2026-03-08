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

        <h2><span className="first-letter">A</span>bout the Hackathon</h2>

        <p>
        Join us for an exciting hackathon where creativity meets technology! Whether you're a seasoned developer or just starting out, this event is the perfect opportunity to collaborate, innovate, and bring your ideas to life. Over the course of 48 hours, teams will work together to solve challenges, build prototypes, and compete for amazing prizes. Don't miss out on this chance to connect with like-minded individuals and make a real impact in the tech community. See you there!
        </p>

        
        <Link to="/contact" className="join-btn"><button>Contact Now</button></Link>                              


        <div className="hackathon-stats">

          <div className="stat">
            <h3>{creativity}%</h3>
            <span>Creativity</span>
          </div>

          <div className="stat">
            <h3>+{team}</h3>
            <span>Team</span>
          </div>

          <div className="stat">
            <h3>+{ideas}</h3>
            <span>Ideas</span>
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