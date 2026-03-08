import './Home.css'
import { Link } from "react-router-dom";

 import Spline from '@splinetool/react-spline';
  function Home() {
     return ( <div className="home">
         {/* الروبوت كامل في الخلفية */}
          <div className="spline-background">
             <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" /> 
             </div>
              {/* المحتوى فوق الروبوت */}
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
                             <h1><span className="first-letter">W</span>elcome to Our Hackathon</h1>
                              <p>Build innovative projects with AI & Big Data</p> 
                              <Link to="/registrationForm" className="join-btn"><button>Join Now</button></Link>                              
                              </div> 
                               </div> 
                               </div> ) }
                               export default Home