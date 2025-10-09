// src/components/Navbar.jsx
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Services', href: '#services' },
        { name: 'Qualification', href: '#qualification' },
        { name: 'Contact', href: '#contact' },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <header className="header">
            <nav className="navbar container">
                <a href="#home" className="navbar-logo">
                    Nardos
                </a>

                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            onClick={handleLinkClick}
                            className="navbar-link"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="navbar-toggle">
                    {/* Placeholder icon for the right side of the desktop menu */}
                    <button className="info-icon">i</button>
                    <button onClick={toggleMenu} className="menu-button">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;