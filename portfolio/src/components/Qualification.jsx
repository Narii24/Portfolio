// src/components/Qualification.jsx
import React, { useState } from 'react';
import { FaGraduationCap, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import './Qualification.css';

const Qualification = () => {
    const [activeTab, setActiveTab] = useState('education');

    const educationData = [
        { 
            title: 'Computer Science', 
            place: 'Unity University', 
            year: '2021 - 2025' ,
        },
        { 
            title: 'UI/UX', 
            place: 'LXD', 
            year: '2025',
        },
    ];

    const experienceData = [
        { 
            title: 'Website Design', 
            place: 'Unity University LXD', 
            year: '2022 - 2025',
        },
        { 
            title: 'Content Creator', 
            place: 'Nor media', 
            year: '2025',
        },
        { 
            title: 'Project Officer, Assistant', 
            place: 'Rotaract Club of Abugida', 
            year: '2023 - 2025',
        },
    ];

    const TimelineItem = ({ title, place, year, isRight }) => (
        <div className={`timeline-item-wrapper ${isRight ? 'align-right' : 'align-left'}`}>
            <div className="timeline-content">
                <h4 className="timeline-title">{title}</h4>
                <span className="timeline-place">{place}</span>
                <span className="timeline-year">
                    <FaCalendarAlt className="calendar-icon" />
                    {year}
                </span>
            </div>
        </div>
    );

    const currentData = activeTab === 'education' ? educationData : experienceData;

    return (
        <section id="qualification" className="qualification section">
            <div className="section-title">
                <h2>Qualification</h2>
                <p>My personal journey</p>
            </div>

            {/* Tab Switcher */}
            <div className="qualification-tabs container">
                <button 
                    onClick={() => setActiveTab('education')}
                    className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
                >
                    <FaGraduationCap />
                    <span>Education</span>
                </button>
                <button 
                    onClick={() => setActiveTab('experience')}
                    className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
                >
                    <FaBriefcase />
                    <span>Experience</span>
                </button>
            </div>

            {/* Timeline Content */}
            <div className="qualification-content container">
                <div className="timeline-container">
                    {currentData.map((item, index) => (
                        <TimelineItem 
                            key={index} 
                            title={item.title} 
                            place={item.place}
                            year={item.year}
                            isRight={index % 2 !== 0} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Qualification;