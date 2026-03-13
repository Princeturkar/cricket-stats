import { Link } from "react-router-dom";


function PlayerCard({ player, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${player.name}?`)) {
      onDelete(player._id);
    }
  };

  return (
    <div className="player-card-wrapper" style={{ position: 'relative' }}>
      <Link to={`/players/${player._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="player-profile-card">
          <div className="profile-header">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
                 <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{player.team}</span>
               </div>
               {onDelete && (
                 <button 
                   onClick={handleDelete}
                   className="delete-player-btn"
                   title="Delete Player"
                   style={{
                     background: 'rgba(255, 77, 77, 0.1)',
                     color: '#ff4d4d',
                     border: '1px solid rgba(255, 77, 77, 0.3)',
                     borderRadius: '4px',
                     padding: '2px 8px',
                     cursor: 'pointer',
                     fontSize: '0.7rem',
                     fontWeight: 'bold',
                     transition: 'all 0.3s',
                     zIndex: 10
                   }}
                   onMouseOver={(e) => e.target.style.background = 'rgba(255, 77, 77, 0.2)'}
                   onMouseOut={(e) => e.target.style.background = 'rgba(255, 77, 77, 0.1)'}
                 >
                   DELETE
                 </button>
               )}
            </div>
            <div className="profile-name">{player.name}</div>
            <div className="profile-role">
              <span style={{ color: 'var(--cyan)' }}>≫</span> {player.role}
            </div>
          </div>
          
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-label">Matches</div>
              <div className="stat-value">{player.matches}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Runs</div>
              <div className="stat-value">{player.runs}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Average</div>
              <div className="stat-value">{player.battingAvg}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Strike Rate</div>
              <div className="stat-value">{player.strikeRate}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Highest Score</div>
              <div className="stat-value">{player.highScore}*</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Wickets</div>
              <div className="stat-value">{player.wickets}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PlayerCard;