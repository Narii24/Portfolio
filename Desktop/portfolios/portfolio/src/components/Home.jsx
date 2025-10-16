// src/components/Home.jsx
import React from 'react';
import { FaLinkedinIn, FaGithub, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import './Home.css';
import NardosPhoto from '../assets/photo_5988001691817078853_y.jpg'; 

const Home = () => {
    const socialLinks = [
        { Icon: FaInstagram, href: 'https://www.instagram.com/' },
        { Icon: FaGithub, href: 'https://github.com/' }, // Using GitHub link
        { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/nardos-guder-1741772a9' },
    ];

    return (
        <section id="home" className="home">
            <div className="home-content container">
                
                {/* Social Links */}
                <div className="home-social">
                    {socialLinks.map((link, index) => (
                        <a 
                            key={index}
                            href={link.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            <link.Icon />
                        </a>
                    ))}
                </div>

                {/* Center Content - Text and Photo */}
                <div className="home-main">
                    <div className="home-text">
                        <h1 className="home-title">
                            Nardos Guder <span role="img" aria-label="wave">👋</span>
                        </h1>
                        
                        <div className="home-divider"></div>
                        
                        <h2 className="home-subtitle">
                            Frontend Web Developer based in Ethiopia
                        </h2>
                        
                        <p className="home-description">
                            I am a front end developer from Addis Ababa, I am very passionate and dedicated to my work.
                        </p>
                        
                        <a 
                            href="#contact"
                            className="button-primary home-button"
                        >
                            <span>Say Hello</span>
                            <FaPaperPlane className="icon-emoji" /> 
                        </a>
                    </div>

                    {/* Photo */}
                    <div className="home-photo-container">
                        {/* The animation part is handled by the CSS (Home.css) */}
                        <img 
                            src={NardosPhoto} 
                            alt="Nardos Guder" 
                            className="home-photo"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;