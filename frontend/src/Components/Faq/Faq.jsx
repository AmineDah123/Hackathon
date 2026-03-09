import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown } from 'react-icons/fa';

const faqData = [
  {
    question: "Où a lieu le hackathon ?",
    answer: "L'événement se déroule à Agadir, Maroc. L'adresse exacte du lieu sera partagée avec les participants confirmés par email une semaine avant l'événement."
  },
  {
    question: "Quand l'événement commence-t-il et se termine-t-il ?",
    answer: "Le hackathon débute le jeudi 1er mai 2026 à 9h00 et se termine le vendredi 2 mai 2026 à 16h00 — une expérience complète de 48 heures."
  },
  {
    question: "Qui peut participer ?",
    answer: "Le hackathon est ouvert aux étudiants, développeurs, designers et passionnés de technologie. La seule condition est d'avoir une véritable passion pour créer des technologies qui aident les personnes handicapées."
  },
  {
    question: "Quel est le thème de ce hackathon ?",
    answer: "Ce hackathon est 100% axé sur les technologies d'assistance et l'accessibilité. Nous vous mettons au défi de créer des solutions qui améliorent la vie quotidienne des personnes ayant un handicap moteur, visuel, auditif ou cognitif."
  },
  {
    question: "Y a-t-il des frais d'inscription ?",
    answer: "Non, la participation est entièrement gratuite. Des repas et des collations sont fournis tout au long de l'événement. Vous n'avez besoin d'apporter que votre ordinateur portable et vos idées."
  },
  {
    question: "Combien de personnes peuvent être dans une équipe ?",
    answer: "Chaque équipe doit compter exactement 4 membres. Les 4 doivent être inscrits via le formulaire d'inscription sur ce site web avant la date limite."
  },
  {
    question: "Que dois-je apporter à l'événement ?",
    answer: "Apportez votre ordinateur portable, chargeur, une pièce d'identité valide et tout ce dont vous avez besoin pour rester à l'aise pendant 48 heures. Le lieu disposera de prises de courant, de WiFi et d'espaces de repos."
  },
  {
    question: "Y a-t-il des prix pour les équipes gagnantes ?",
    answer: "Oui, les meilleures équipes recevront des prix et une reconnaissance. Les détails complets des prix seront annoncés plus près de la date de l'événement."
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
        <h2 className="main-title"><span className="first-letter">F</span>OIRE AUX QUESTIONS</h2>
        <p className="subtitle">DES QUESTIONS ?</p>

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