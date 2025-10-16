// src/components/ServiceModal.jsx
import React from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import './ServiceModal.css';

const ServiceModal = ({ title, services, onClose }) => {
    return (
        // Modal Overlay 
        <div className="modal-overlay" onClick={onClose}>
            
            {/* Modal Content */}
            <div 
                className="modal-content"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="modal-close-button"
                >
                    <FaTimes />
                </button>

                {/* Header */}
                <h3 className="modal-title">{title}</h3>
                <p className="modal-subtitle">Services with more than 3 years of experience. Providing quality work to clients and companies.</p>

                {/* Service List */}
                <ul className="modal-service-list">
                    {services.map((service, index) => (
                        <li key={index} className="modal-service-item">
                            <FaCheckCircle className="modal-check-icon" />
                            <span>{service}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ServiceModal;