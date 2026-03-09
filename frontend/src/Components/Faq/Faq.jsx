import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown } from 'react-icons/fa';

const faqData = [
  {
    question: "Where is the hackathon taking place?",
    answer: "The event is held in Agadir, Morocco. The exact venue address will be shared with confirmed participants via email one week before the event."
  },
  {
    question: "When does the event start and end?",
    answer: "The hackathon kicks off on Thursday, May 1st 2026 at 9:00 AM and wraps up on Friday, May 2nd 2026 at 4:00 PM — a full 48-hour experience."
  },
  {
    question: "Who can participate?",
    answer: "The hackathon is open to students, developers, designers, and tech enthusiasts. The only requirement is a genuine passion for building technology that helps people with disabilities."
  },
  {
    question: "What is the theme of this hackathon?",
    answer: "This hackathon is 100% focused on assistive technology and accessibility. We challenge you to build solutions that improve the daily lives of people with mobility, vision, hearing, or cognitive disabilities."
  },
  {
    question: "Is there a registration fee?",
    answer: "No, participation is completely free. Meals and snacks are provided throughout the event. All you need to bring is your laptop and your ideas."
  },
  {
    question: "How many people can be in a team?",
    answer: "Each team must have exactly 4 members. All 4 must be registered through the registration form on this website before the deadline."
  },
  {
    question: "What should I bring to the event?",
    answer: "Bring your laptop, charger, a valid ID, and anything you need to stay comfortable for 48 hours. The venue will have power outlets, WiFi, and rest areas."
  },
  {
    question: "Will there be mentors available?",
    answer: "Yes! Experienced mentors from the tech and accessibility space will be on-site throughout the event to guide your team and give technical feedback."
  },
  {
    question: "Are there prizes for winning teams?",
    answer: "Yes, the top teams will receive prizes and recognition. Full prize details will be announced closer to the event date."
  },
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