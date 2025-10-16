// src/components/Services.jsx
import React, { useState } from 'react';
import ServiceModal from './ServiceModal'; 
import './Services.css';

const Services = () => {
    const [modalOpen, setModalOpen] = useState(null);

    const webDesignerServices = [
        "I develop the user interface using figma and canva.",
        "Web page development.",
        "UX element interaction.",
        "Frontend.",
        "UI/UX design.",
        "Problem solving.",
    ];

    // UI/UX uses the same list as requested
    const uiUxDesignerServices = [...webDesignerServices]; 

    const serviceData = [
        { 
            title: 'Web Designer', 
            icon: '&#9634;', 
            services: webDesignerServices 
        },
        { 
            title: 'UI/UX Designer', 
            icon: '<>', 
            services: uiUxDesignerServices 
        },
        // Branding Designer card is removed as requested
    ];

    const handleViewMore = (title) => {
        setModalOpen(title);
    };

    const closeModal = () => {
        setModalOpen(null);
    };

    const ServiceCard = ({ title, icon, onClick }) => (
        <div 
            className="service-card"
            onClick={onClick}
        >
            <div className="service-icon" dangerouslySetInnerHTML={{ __html: icon }} /> 
            
            <h3 className="service-title">{title}</h3>
            
            <button 
                className="service-view-button"
            >
                <span>View More</span>
                <span className="arrow">&rarr;</span>
            </button>
        </div>
    );

    return (
        <section id="services" className="services section">
            <div className="section-title">
                <h2>Services</h2>
                <p>What I offer</p>
            </div>
            
            {/* Adjusted layout for two cards */}
            <div className="services-content container" style={{ justifyContent: 'space-around', gap: '3rem' }}>
                {serviceData.map((service, index) => (
                    <ServiceCard 
                        key={index}
                        title={service.title} 
                        icon={service.icon} 
                        onClick={() => handleViewMore(service.title)} 
                    />
                ))}
            </div>

            {/* Render Modal */}
            {modalOpen && (
                <ServiceModal 
                    title={modalOpen} 
                    services={serviceData.find(s => s.title === modalOpen)?.services || []}
                    onClose={closeModal}
                />
            )}
        </section>
    );
};

export default Services;