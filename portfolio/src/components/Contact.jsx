// src/components/Contact.jsx
import React from 'react';
import { FaEnvelope, FaPhone, FaComments, FaPaperPlane, FaFacebook, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'; 
import './Contact.css';

const Contact = () => {
    const contactInfo = [
        { 
            title: 'Email', 
            icon: FaEnvelope, 
            value: 'nardosguder@gmail.com',
            link: 'mailto:nardosguder@gmail.com',
            buttonText: 'Write me',
        },
        { 
            title: 'Phone', // Replaced Whatsapp with Phone
            icon: FaPhone, 
            value: '0988482855',
            link: 'tel:+251988482855', 
            buttonText: 'Call me',
        },
        { 
            title: 'Messenger', 
            icon: FaComments, 
            value: 'user.fb.123', 
            link: 'https://m.me/YourFacebookID', 
            buttonText: 'Write me',
        },
    ];

    const footerSocials = [
        { Icon: FaFacebook, href: 'https://web.facebook.com/?_rdc=1&_rdr#' },
        { Icon: FaInstagram, href: 'https://www.instagram.com/' },
        { Icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/nardos-guder-1741772a9' },
        { Icon: FaGithub, href: 'https://github.com/' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message Sent (Demo Functionality).');
    };

    const InputField = ({ id, label, placeholder, type = "text", isTextArea = false }) => (
        <div className="input-field-wrapper">
            <label 
                htmlFor={id} 
                className="input-label"
            >
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    id={id}
                    name={id}
                    rows="6"
                    placeholder={placeholder}
                    className="input-control textarea-control"
                    required
                />
            ) : (
                <input
                    type={type}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    className="input-control"
                    required
                />
            )}
        </div>
    );

    return (
        <section id="contact" className="contact section">
            <div className="section-title">
                <h2>Contact Me</h2>
                <p>Get in touch</p>
            </div>

            <div className="contact-content container">
                
                {/* Contact Cards (Talk to me) */}
                <div className="contact-info">
                    <h3 className="contact-heading">Talk to me</h3>
                    
                    <div className="contact-cards">
                        {contactInfo.map((item, index) => (
                            <div key={index} className="contact-card">
                                <item.icon className="contact-icon" />
                                <h4 className="card-title">{item.title}</h4>
                                <p className="card-value">{item.value}</p>
                                <a 
                                    href={item.link} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card-button"
                                >
                                    {item.buttonText} &rarr;
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Contact Form (Write me your project) */}
                <div className="contact-form-wrapper">
                    <h3 className="contact-heading">Write me your project</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        
                        <InputField id="name" label="Name" placeholder="Insert your name" />
                        <InputField id="mail" label="Mail" placeholder="Insert your email" type="email" />
                        <InputField id="project" label="Project" placeholder="Write your project" isTextArea={true} />
                        
                        <button 
                            type="submit"
                            className="button-primary submit-button"
                        >
                            <span>Send Message</span>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Footer Section */}
            <footer className="footer container">
                <h3 className="footer-logo">Nardos</h3>
                <div className="footer-links">
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#services">Services</a>
                </div>
                <div className="footer-socials">
                    {footerSocials.map((social, index) => (
                        <a 
                            key={index} 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <social.Icon />
                        </a>
                    ))}
                </div>
                <p className="footer-copy">© Nardos Guder. All rights reserved.</p>
            </footer>
        </section>
    );
};

export default Contact;