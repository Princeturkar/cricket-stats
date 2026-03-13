import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import PlayerNavbar from "../components/PlayerNavbar";
import "../styles/PlayerProfile.css";

function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await API.get(`/players/${id}`);
        setPlayer(res.data);
      } catch (err) {
        setError("Player not found or error fetching details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) return <div className="player-profile-page"><p style={{ padding: '50px', textAlign: 'center' }}>Loading player profile...</p></div>;
  if (error) return <div className="player-profile-page"><p style={{ color: 'red', padding: '50px', textAlign: 'center' }}>{error}</p></div>;
  if (!player) return <div className="player-profile-page"><p style={{ padding: '50px', textAlign: 'center' }}>Player not found.</p></div>;

  return (
    <div className="player-profile-page">
      {/* Sticky Separate Navbar */}
      <PlayerNavbar />

      <main className="profile-container">
        {/* Overview Section */}
        <section id="overview" className="profile-hero">
          <div className="player-image-container">
            <img 
              src={player.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random&size=512&color=fff`} 
              alt={player.name} 
              className="player-main-img" 
            />
          </div>
          
          <div className="player-info-card">
            <div className="card-header">
              <h1>{player.name}</h1>
              <div className="player-team-role">
                <span className="team-badge">🏏 {player.team}</span>
                <span className="role-badge">| {player.role}</span>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nationality</span>
                <span className="info-value">{player.nationality || "Indian"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">{player.dob || "Jan 01, 1995"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Batting Style</span>
                <span className="info-value">{player.battingStyle || "Right-handed"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bowling Style</span>
                <span className="info-value">{player.bowlingStyle || "Right-arm Fast"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Jersey Number</span>
                <span className="info-value">#{player.jerseyNumber || "18"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Position</span>
                <span className="info-value">{player.role}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section id="biography" className="profile-section">
          <h2 className="section-title">Biography</h2>
          <div className="bio-content">
            <p>{player.description || `${player.name} is a professional cricketer who plays for ${player.team}. Known for his exceptional skills and dedication to the game, he has become a key player in the squad.`}</p>
            <p>From an early age, {player.name.split(' ')[0]} showed immense potential and quickly rose through the domestic ranks before making his mark on the international stage.</p>
          </div>
        </section>

        {/* Career Section */}
        <section id="career" className="profile-section">
          <h2 className="section-title">Career History</h2>
          <div className="career-history">
            <p><strong>Early Years:</strong> Started playing at the regional level in 2010.</p>
            <p><strong>Professional Debut:</strong> Made debut for {player.team} in 2015.</p>
            <p><strong>Major Milestones:</strong> Represented national team in major tournaments including the World Cup.</p>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="profile-section">
          <h2 className="section-title">Match Statistics</h2>
          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Matches</th>
                  <th>Runs</th>
                  <th>Avg</th>
                  <th>SR</th>
                  <th>100s / 50s</th>
                  <th>Wickets</th>
                  <th>Best</th>
                </tr>
              </thead>
              <tbody>
                {/* T20I Stats (Default/Root Fields) */}
                <tr>
                  <td><strong>T20I</strong></td>
                  <td>{player.matches}</td>
                  <td>{player.runs}</td>
                  <td>{player.battingAvg}</td>
                  <td>{player.strikeRate}</td>
                  <td>{player.hundreds || 0} / {player.fifties || 0}</td>
                  <td>{player.wickets || 0}</td>
                  <td>{player.bestBowling || "N/A"}</td>
                </tr>
                {/* ODI Stats (Sub-object) */}
                <tr>
                  <td><strong>ODI</strong></td>
                  <td>{player.odi?.matches || 0}</td>
                  <td>{player.odi?.runs || 0}</td>
                  <td>{player.odi?.avg || 0}</td>
                  <td>{player.odi?.sr || 0}</td>
                  <td>{player.odi?.hundreds || 0} / {player.odi?.fifties || 0}</td>
                  <td>{player.odi?.wickets || 0}</td>
                  <td>{player.odi?.best || "0/0"}</td>
                </tr>
                {/* Test Stats (Sub-object) */}
                <tr>
                  <td><strong>Test</strong></td>
                  <td>{player.test?.matches || 0}</td>
                  <td>{player.test?.runs || 0}</td>
                  <td>{player.test?.avg || 0}</td>
                  <td>{player.test?.sr || 0}</td>
                  <td>{player.test?.hundreds || 0} / {player.test?.fifties || 0}</td>
                  <td>{player.test?.wickets || 0}</td>
                  <td>{player.test?.best || "0/0"}</td>
                </tr>
                {/* IPL Stats (Sub-object) */}
                <tr>
                  <td><strong>IPL</strong></td>
                  <td>{player.ipl?.matches || 0}</td>
                  <td>{player.ipl?.runs || 0}</td>
                  <td>{player.ipl?.avg || 0}</td>
                  <td>{player.ipl?.sr || 0}</td>
                  <td>{player.ipl?.hundreds || 0} / {player.ipl?.fifties || 0}</td>
                  <td>{player.ipl?.wickets || 0}</td>
                  <td>{player.ipl?.best || "0/0"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="profile-section">
          <h2 className="section-title">Achievements</h2>
          <ul className="achievements-list">
            {player.achievements && player.achievements.length > 0 ? (
              player.achievements.map((item, index) => (
                <li key={index}>🏆 {item}</li>
              ))
            ) : (
              <li>No major achievements listed.</li>
            )}
          </ul>
        </section>

        {/* Records Section */}
        <section id="records" className="profile-section">
          <h2 className="section-title">Records</h2>
          <ul className="records-list">
            {player.records && player.records.length > 0 ? (
              player.records.map((item, index) => (
                <li key={index}>✨ {item}</li>
              ))
            ) : (
              <li>No major records listed.</li>
            )}
          </ul>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="profile-section">
          <h2 className="section-title">Photo Gallery</h2>
          <div className="photo-gallery">
            {player.gallery && player.gallery.length > 0 ? (
              player.gallery.map((img, idx) => (
                <div key={idx} className="gallery-item">
                  <img src={img} alt={`${player.name} gallery ${idx + 1}`} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/player_hero.png";
                  }} />
                </div>
              ))
            ) : (
              // Fallback if no specific gallery
              <>
                <div className="gallery-item"><img src="/player_action.png" alt="Action Shot" /></div>
                <div className="gallery-item"><img src="/player_celebration.png" alt="Celebration" /></div>
                <div className="gallery-item"><img src="/player_training.png" alt="Training" /></div>
                <div className="gallery-item"><img src="/player_fielding.png" alt="Fielding" /></div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9f9f9', borderTop: '1px solid #eee', marginTop: '60px' }}>
        <p>© 2026 Cricket Arena Sports Database. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PlayerDetails;
