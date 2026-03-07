import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown } from 'react-icons/fa'; // npm install react-icons

const faqData = [
  {
    question: "Who can join the hackathon?",
    answer: "The event is open to students, developers, designers, and entrepreneurs. Whether you are a coding wizard or a UI/UX enthusiast, as long as you are 18+ and have a passion for innovation, you're in!"
  },
  {
    question: "Is there a registration fee?",
    answer: "No, the hackathon is completely free of charge! We provide the venue, food, and swag. You just need to bring your laptop and your brainpower."
  },
  {
    question: "Do I need to have a team before registering?",
    answer: "Not necessarily! You can register as an individual or a team (up to 4 people). We will organize a team-building session at the start of the event for those looking for partners."
  },
  {
    question: "What is the selection process?",
    answer: "After registration, our team reviews applications based on skills and motivation. You will receive an email confirming if you have been selected to participate."
  },
  {
    question: "What can I build during the event?",
    answer: "You can build any software or hardware project that fits into one of our tracks (AI, GreenTech, etc.). The project must be started and finished during the 48 hours of the hackathon."
  },
  {
    question: "Are there any prizes for the winners?",
    answer: "Yes! There will be cash prizes for the top 3 teams, along with special awards from our sponsors and potential internship or incubation opportunities."
  },
  {
  question: "Who can participate?",
    answer: "Open to students, professionals, and tech enthusiasts aged 18+. All backgrounds are welcome!"
  },
  {
    question: "Is it free to join?",
    answer: "Yes, the event is 100% free! We provide the space, food, and mentorship for all selected teams."
  },
  {
    question: "Do I need a team?",
    answer: "You can apply solo or as a team of 2-4. If you're solo, we'll help you find a team on Day 1."
  },

  // Row 2
  {
    question: "What should I bring?",
    answer: "Your laptop, charger, a valid ID, and a positive attitude! A sleeping bag is optional but recommended."
  },
  {
    question: "What are the prizes?",
    answer: "We have cash prizes for the top 3 teams, sponsor-specific awards, and internship opportunities."
  },
  {
    question: "Can I use AI tools?",
    answer: "Yes! Tools like ChatGPT and GitHub Copilot are allowed to help you speed up your development process."
  },

  // Row 3
  {
    question: "What can I build?",
    answer: "Anything that fits our tracks (AI, GreenTech, etc.). It can be a web app, mobile app, or hardware hack."
  },
  {
    question: "Is it an overnight event?",
    answer: "Yes! It's a non-stop 48-hour marathon. We have dedicated quiet zones for those who need a nap."
  }
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <h2 className="main-title"><span className="first-letter">F</span>REQUENTLY ASKED QUESTIONS</h2>
        <p className="subtitle">ANY QUESTIONS?</p>
        
        <div className="accordion-container">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="accordion-header">
                <h3>{item.question}</h3>
                <FaChevronDown className="arrow-icon" />
              </div>
              <div className="accordion-content">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;