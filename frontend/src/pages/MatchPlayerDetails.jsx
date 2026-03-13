import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function MatchPlayerDetails() {
  const { matchId, playerName, playerTeam } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/matches/${matchId}`);
        setMatch(res.data);

        const foundPlayer = res.data.players?.find(
          p => p.name.toLowerCase() === decodeURIComponent(playerName).toLowerCase() &&
               p.team.toLowerCase() === decodeURIComponent(playerTeam).toLowerCase()
        );

        setPlayer(foundPlayer);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId, playerName, playerTeam]);

  if (loading) return <div className="page"><p>Loading player details...</p></div>;
  if (!match || !player) return <div className="page"><p>Player not found in this match.</p></div>;

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} className="login-btn" style={{ width: 'auto', marginBottom: '20px', padding: '8px 16px' }}>
        ← Back
      </button>

      <div className="player-profile-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="profile-header">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏏</span>
            <span style={{ fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--cyan)' }}>{player.team}</span>
          </div>
          <div className="profile-name" style={{ fontSize: '2.5rem' }}>{player.name}</div>
          <div className="profile-role" style={{ fontSize: '1.2rem' }}>
            <span style={{ color: 'var(--cyan)' }}>≫</span> {player.role}
          </div>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0, 123, 255, 0.05)', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--cyan)', marginTop: 0 }}>Match Performance</h3>
          <p style={{ fontSize: '0.95em', color: '#666' }}>
            {match.teamA} <strong>vs</strong> {match.teamB}
          </p>
        </div>

        <div className="stats-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="stat-item">
            <div className="stat-label">RUNS</div>
            <div className="stat-value">{player.runs}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">BALLS FACED</div>
            <div className="stat-value">{player.ballsFaced}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">STRIKE RATE</div>
            <div className="stat-value">{player.strikeRate.toFixed(2)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">AVERAGE</div>
            <div className="stat-value">{player.battingAvg.toFixed(2)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">WICKETS</div>
            <div className="stat-value">{player.wickets}</div>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <h3 style={{ color: 'var(--cyan)', marginBottom: '15px' }}>Match Information</h3>
          <p><strong>Match:</strong> {match.teamA} vs {match.teamB}</p>
          <p><strong>Status:</strong> {match.status}</p>
          <p><strong>Overs:</strong> {match.overs}</p>
          <p><strong>Score {match.teamA}:</strong> {match.scoreA}</p>
          <p><strong>Score {match.teamB}:</strong> {match.scoreB}</p>
        </div>
      </div>
    </div>
  );
}

export default MatchPlayerDetails;
