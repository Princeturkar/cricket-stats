import React, { useState, useEffect } from 'react';
import '../styles/PlayerProfile.css';

const PlayerNavbar = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const navLinks = [
        { id: 'overview', label: 'Overview' },
        { id: 'biography', label: 'Biography' },
        { id: 'career', label: 'Career' },
        { id: 'statistics', label: 'Statistics' },
        { id: 'achievements', label: 'Achievements' },
        { id: 'records', label: 'Records' },
        { id: 'gallery', label: 'Gallery' }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // Account for sticky navbars
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = navLinks.map(link => document.getElementById(link.id));
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        setActiveSection(section.id);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="player-sub-navbar">
            <div className="player-nav-container">
                <ul className="player-nav-links">
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <button
                                onClick={() => scrollToSection(link.id)}
                                className={activeSection === link.id ? 'active' : ''}
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default PlayerNavbar;
