// src/components/Skills.jsx
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './Skills.css';

const Skills = () => {
    const skillSet = {
        frontend: [
            { skill: 'HTML', level: 'Intermediate' },
            { skill: 'CSS', level: 'Intermediate' },
            { skill: 'JavaScript', level: 'Intermediate' },
            { skill: 'React', level: 'Intermediate' },
            { skill: 'Tailwind', level: 'Intermediate' },
            { skill: 'Git', level: 'Intermediate' },
        ],
        backend: [
            { skill: 'PHP', level: 'Intermediate' },
            { skill: 'MySQL', level: 'Intermediate' },
            { skill: 'SQL', level: 'Intermediate' },
            { skill: 'Node.js', level: 'Basic' }, // Only Node.js is Basic
        ]
    };

    const SkillItem = ({ skill, level }) => (
        <div className="skill-item">
            <FaCheckCircle className="skill-check-icon" />
            <div>
                <h4 className="skill-name">{skill}</h4>
                <p className="skill-level">{level}</p>
            </div>
        </div>
    );

    const SkillCard = ({ title, skills }) => (
        <div className="skill-card">
            <h3 className="skill-card-title">{title}</h3>
            <div className="skill-list" style={{
                // Adjust grid for Backend if it has fewer items
                gridTemplateColumns: skills.length > 4 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'
            }}>
                {skills.map((item, index) => (
                    <SkillItem key={index} skill={item.skill} level={item.level} />
                ))}
            </div>
        </div>
    );

    return (
        <section id="skills" className="skills section">
            <div className="section-title">
                <h2>Skills</h2>
                <p>My technical level</p>
            </div>

            <div className="skills-content container">
                <SkillCard title="Frontend developer" skills={skillSet.frontend} />
                <SkillCard title="Backend developer" skills={skillSet.backend} />
            </div>
        </section>
    );
};

export default Skills;