import React from 'react';
import './Sponsors.css';

const sponsorsData = {
  gold: [
    { id: 1, name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { id: 2, name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  ],
 silver: [
    { id: 3, name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { id: 4, name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Intel_Logo.svg" }, // Link jdid o stable
    { id: 5, name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  ],
  bronze: [
    { id: 6, name: "DigitalOcean", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg" },
    { id: 7, name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  ]
};

function Sponsors() {
  return (
    <section className="sponsors-section" id="sponsors">
      <div className="container">
          <h2 className="main-title"><span className="first-letter">O</span>UR VALUABLE SPONSORS</h2>

        <p className="subtitle">THEY SUPPORT US</p>
      
        {/* Gold Tier */}
        <div className="tier gold-tier">
          <h3 className="tier-label gold"> GOLD PARTNERS</h3>
          <div className="logo-grid">
            {sponsorsData.gold.map(s => (
              <div key={s.id} className="logo-card">
                <img src={s.logo} alt={s.name} title={s.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Silver Tier */}
        <div className="tier silver-tier">
          <h3 className="tier-label silver"> SILVER PARTNERS</h3>
          <div className="logo-grid">
            {sponsorsData.silver.map(s => (
              <div key={s.id} className="logo-card small">
                <img src={s.logo} alt={s.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Bronze Tier */}
        <div className="tier bronze-tier">
          <h3 className="tier-label bronze"> BRONZE PARTNERS</h3>
          <div className="logo-grid">
            {sponsorsData.bronze.map(s => (
              <div key={s.id} className="logo-card x-small">
                <img src={s.logo} alt={s.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sponsors;