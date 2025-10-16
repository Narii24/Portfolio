// src/App.jsx
import React from 'react';
import './index.css'; // Load global styles

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Qualification from './components/Qualification';
import Contact from './components/Contact';

const App = () => {
    return (
        <div className="app-container">
            <Navbar /> 
            <main>
                <Home /> 
                <About />
                <Skills />
                <Services />
                <Qualification />
                <Contact />
            </main>
        </div>
    );
};

export default App;