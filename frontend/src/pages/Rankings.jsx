import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import RankingNavbar from '../components/RankingNavbar';
import './Rankings.css';

const Rankings = () => {
    const { setTheme } = useOutletContext();
    const [activeCategory, setActiveCategory] = useState('teams');
    const [activeFormat, setActiveFormat] = useState('t20i');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (setTheme) setTheme(activeFormat);
    }, [activeFormat, setTheme]);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, [activeCategory, activeFormat]);

    // Projected 2026 Rankings (Based on recent seeded successes and rising stars)
    const rankingsData = {
        teams: {
            t20i: [
                { rank: 1, name: 'India', rating: 272, points: 18450, change: 'up' },
                { rank: 2, name: 'Australia', rating: 264, points: 15200, change: 'none' },
                { rank: 3, name: 'South Africa', rating: 258, points: 14100, change: 'up' },
                { rank: 4, name: 'England', rating: 255, points: 13800, change: 'down' },
                { rank: 5, name: 'West Indies', rating: 251, points: 12900, change: 'up' }
            ],
            odi: [
                { rank: 1, name: 'India', rating: 128, points: 6450, change: 'none' },
                { rank: 2, name: 'Australia', rating: 119, points: 5800, change: 'none' },
                { rank: 3, name: 'New Zealand', rating: 112, points: 5100, change: 'up' },
                { rank: 4, name: 'South Africa', rating: 108, points: 4900, change: 'down' },
                { rank: 5, name: 'Pakistan', rating: 105, points: 4600, change: 'none' }
            ],
            test: [
                { rank: 1, name: 'Australia', rating: 126, points: 3800, change: 'none' },
                { rank: 2, name: 'South Africa', rating: 118, points: 3200, change: 'up' },
                { rank: 3, name: 'India', rating: 115, points: 4100, change: 'down' },
                { rank: 4, name: 'England', rating: 112, points: 4400, change: 'none' },
                { rank: 5, name: 'New Zealand', rating: 101, points: 2900, change: 'none' }
            ]
        },
        batting: {
            t20i: [
                { rank: 1, name: 'Yashasvi Jaiswal', team: 'IND', rating: 884, change: 'up' },
                { rank: 2, name: 'Suryakumar Yadav', team: 'IND', rating: 852, change: 'down' },
                { rank: 3, name: 'Phil Salt', team: 'ENG', rating: 815, change: 'none' },
                { rank: 4, name: 'Travis Head', team: 'AUS', rating: 798, change: 'up' },
                { rank: 5, name: 'Rachin Ravindra', team: 'NZ', rating: 772, change: 'up' }
            ],
            odi: [
                { rank: 1, name: 'Shubman Gill', team: 'IND', rating: 835, change: 'up' },
                { rank: 2, name: 'Babar Azam', team: 'PAK', rating: 812, change: 'down' },
                { rank: 3, name: 'Virat Kohli', team: 'IND', rating: 794, change: 'none' },
                { rank: 4, name: 'Rohit Sharma', team: 'IND', rating: 781, change: 'none' },
                { rank: 5, name: 'Harry Brook', team: 'ENG', rating: 765, change: 'up' }
            ],
            test: [
                { rank: 1, name: 'Joe Root', team: 'ENG', rating: 894, change: 'up' },
                { rank: 2, name: 'Kane Williamson', team: 'NZ', rating: 865, change: 'down' },
                { rank: 3, name: 'Steve Smith', team: 'AUS', rating: 841, change: 'none' },
                { rank: 4, name: 'Yashasvi Jaiswal', team: 'IND', rating: 822, change: 'up' },
                { rank: 5, name: 'Daryl Mitchell', team: 'NZ', rating: 795, change: 'none' }
            ]
        },
        bowling: {
            t20i: [
                { rank: 1, name: 'Rashid Khan', team: 'AFG', rating: 742, change: 'up' },
                { rank: 2, name: 'Adil Rashid', team: 'ENG', rating: 718, change: 'down' },
                { rank: 3, name: 'Jasprit Bumrah', team: 'IND', rating: 705, change: 'up' },
                { rank: 4, name: 'Wanindu Hasaranga', team: 'SL', rating: 692, change: 'none' },
                { rank: 5, name: 'Anrich Nortje', team: 'SA', rating: 678, change: 'up' }
            ],
            odi: [
                { rank: 1, name: 'Jasprit Bumrah', team: 'IND', rating: 735, change: 'up' },
                { rank: 2, name: 'Josh Hazlewood', team: 'AUS', rating: 712, change: 'down' },
                { rank: 3, name: 'Mohammed Siraj', team: 'IND', rating: 698, change: 'none' },
                { rank: 4, name: 'Adam Zampa', team: 'AUS', rating: 685, change: 'none' },
                { rank: 5, name: 'Kuldeep Yadav', team: 'IND', rating: 674, change: 'up' }
            ],
            test: [
                { rank: 1, name: 'Jasprit Bumrah', team: 'IND', rating: 882, change: 'up' },
                { rank: 2, name: 'Kagiso Rabada', team: 'SA', rating: 855, change: 'up' },
                { rank: 3, name: 'Josh Hazlewood', team: 'AUS', rating: 841, change: 'down' },
                { rank: 4, name: 'Pat Cummins', team: 'AUS', rating: 825, change: 'down' },
                { rank: 5, name: 'Ravichandran Ashwin', team: 'IND', rating: 818, change: 'down' }
            ]
        },
        allrounder: {
            t20i: [
                { rank: 1, name: 'Hardik Pandya', team: 'IND', rating: 245, change: 'up' },
                { rank: 2, name: 'Wanindu Hasaranga', team: 'SL', rating: 232, change: 'none' },
                { rank: 3, name: 'Marcus Stoinis', team: 'AUS', rating: 218, change: 'up' },
                { rank: 4, name: 'Sikandar Raza', team: 'ZIM', rating: 210, change: 'down' },
                { rank: 5, name: 'Liam Livingstone', team: 'ENG', rating: 205, change: 'up' }
            ],
            odi: [
                { rank: 1, name: 'Mohammad Nabi', team: 'AFG', rating: 335, change: 'none' },
                { rank: 2, name: 'Shakib Al Hasan', team: 'BAN', rating: 310, change: 'none' },
                { rank: 3, name: 'Sikandar Raza', team: 'ZIM', rating: 295, change: 'none' },
                { rank: 4, name: 'Glenn Maxwell', team: 'AUS', rating: 282, change: 'up' },
                { rank: 5, name: 'Mehidy Hasan', team: 'BAN', rating: 275, change: 'up' }
            ],
            test: [
                { rank: 1, name: 'Ravindra Jadeja', team: 'IND', rating: 462, change: 'none' },
                { rank: 2, name: 'Ravichandran Ashwin', team: 'IND', rating: 345, change: 'none' },
                { rank: 3, name: 'Shakib Al Hasan', team: 'BAN', rating: 318, change: 'none' },
                { rank: 4, name: 'Joe Root', team: 'ENG', rating: 305, change: 'up' },
                { rank: 5, name: 'Kyle Jamieson', team: 'NZ', rating: 292, change: 'up' }
            ]
        }
    };

    const currentData = rankingsData[activeCategory][activeFormat];

    const getChangeIcon = (change) => {
        if (change === 'up') return <span className="change-icon up">▲</span>;
        if (change === 'down') return <span className="change-icon down">▼</span>;
        return <span className="change-icon none">-</span>;
    };

    return (
        <div className="rankings-container-2026" data-theme={activeFormat}>
            <div className="rankings-hero">
                <div className="hero-content">
                    <h1>ICC RANKINGS <span className="year-badge">2026</span></h1>
                    <p>Official rankings data as of March 12, 2026</p>
                </div>
                <div className="hero-glow"></div>
            </div>

            <RankingNavbar 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory}
                activeFormat={activeFormat}
                setActiveFormat={setActiveFormat}
            />

            <div className={`rankings-grid ${isVisible ? 'fade-in' : ''}`}>
                <div className="rankings-list">
                    {currentData.map((item, index) => (
                        <div key={item.rank} className={`rank-card ${item.rank <= 3 ? 'premium' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="rank-number-box">
                                <span className="rank-value">{item.rank}</span>
                                {getChangeIcon(item.change)}
                            </div>
                            
                            <div className="player-team-info">
                                <div className="main-info">
                                    <h3>{item.name}</h3>
                                    {activeCategory !== 'teams' && <span className="team-badge-pill">{item.team}</span>}
                                </div>
                                <div className="sub-info">
                                    {activeCategory === 'teams' ? `Points: ${item.points.toLocaleString()}` : `ICC Rating: ${item.rating}`}
                                </div>
                            </div>

                            <div className="rating-display">
                                <div className="rating-label">{activeCategory === 'teams' ? 'RATING' : 'POINTS'}</div>
                                <div className="rating-number">{activeCategory === 'teams' ? item.rating : item.rating}</div>
                            </div>

                            {item.rank === 1 && <div className="crown-icon">👑</div>}
                            <div className="card-glass-glow"></div>
                        </div>
                    ))}
                </div>

                <div className="rankings-sidebar">
                    <div className="trend-card">
                        <h4>TRENDING 📈</h4>
                        <div className="trend-item">
                            <p>India remains #1 in T20I after massive winning streak.</p>
                        </div>
                        <div className="trend-item">
                            <p>Yashasvi Jaiswal jumps to #1 in T20I Batting.</p>
                        </div>
                        <div className="trend-item">
                            <p>Jasprit Bumrah leading Test and ODI bowling rankings.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rankings-footer">
                <p>Data provided by CricStats Analytics. Updated daily.</p>
            </div>
        </div>
    );
};

export default Rankings;
