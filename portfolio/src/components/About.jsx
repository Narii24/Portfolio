// src/components/About.jsx
import React from 'react';
import { FaProjectDiagram, FaHeadset, FaFilePdf } from 'react-icons/fa';
import './About.css';
import AboutPhoto from '../assets/photo_5988001691817078853_y.jpg'; 

const About = () => {

    const statCards = [
        { icon: FaProjectDiagram, title: 'Completed', subtitle: '3 Projects' }, // Updated Stat
        { icon: FaHeadset, title: 'Support', subtitle: 'Online 24/7' },
    ];

    // Your detailed paragraph
    const description = `
        Frontend developer I’m Nardos Guder, a Computer Science graduate and passionate web designer who loves creating modern, user-friendly, and creative websites. I have experience working on projects like a Tourism and Pottery Management System and enjoy blending design and technology to bring ideas to life. My goal is to become a highly skilled software and web designer who builds meaningful digital experiences.
    `;

    return (
        <section id="about" className="about section">
            <div className="section-title">
                <h2>About Me</h2>
                <p>My introduction</p>
            </div>
            
            <div className="about-content container">
                
                {/* Photo */}
                <div className="about-photo-wrapper">
                    <img 
                        src={AboutPhoto} 
                        alt="Nardos Guder" 
                        className="about-photo"
                    />
                </div>

                {/* Stats and Description */}
                <div className="about-details">
                    
                    {/* Stat Cards - Removed "Experience" */}
                    <div className="about-stats" style={{ gridTemplateColumns: `repeat(${statCards.length}, 1fr)` }}>
                        {statCards.map((card, index) => (
                            <div key={index} className="stat-card">
                                <card.icon className="stat-icon" />
                                <h4 className="stat-title">{card.title}</h4>
                                <p className="stat-subtitle">{card.subtitle}</p>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="about-description">
                        {description}
                    </p>

                    {/* Download CV Button */}
                    <a 
                        href="/Nardos Guder cv.pdf" 
                        download="Nardos_Guder_CV.pdf"
                        className="button-primary about-cv-button"
                    >
                        <span>Download CV</span>
                        <FaFilePdf />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default About;