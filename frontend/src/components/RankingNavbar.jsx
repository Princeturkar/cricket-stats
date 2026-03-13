
import React from 'react';
import './RankingNavbar.css';

const RankingNavbar = ({ activeCategory, setActiveCategory, activeFormat, setActiveFormat }) => {
    const categories = [
        { id: 'teams', label: 'Teams' },
        { id: 'batting', label: 'Batting' },
        { id: 'bowling', label: 'Bowling' },
        { id: 'allrounder', label: 'All-Rounders' }
    ];

    const formats = [
        { id: 't20i', label: 'T20I' },
        { id: 'odi', label: 'ODI' },
        { id: 'test', label: 'TEST' }
    ];

    return (
        <div className="ranking-nav-wrapper">
            <div className="ranking-nav-container">
                <div className="category-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <div className="format-tabs">
                    {formats.map((fmt) => (
                        <button
                            key={fmt.id}
                            className={`fmt-btn ${activeFormat === fmt.id ? 'active' : ''}`}
                            onClick={() => setActiveFormat(fmt.id)}
                        >
                            {fmt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RankingNavbar;
