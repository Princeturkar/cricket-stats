
import { Link, useNavigate } from "react-router-dom";
import "../App.css"; // Ensure global styles are available

function MatchCard({ match }) {
  const navigate = useNavigate();
  const teamAPlayers = match.players?.filter(p => p.team === match.teamA) || [];
  const teamBPlayers = match.players?.filter(p => p.team === match.teamB) || [];

  const getTopPlayer = (players) => {
    return players.length > 0
      ? players.reduce((prev, current) =>
        prev.runs > current.runs ? prev : current
      )
      : null;
  };

  const teamATop = getTopPlayer(teamAPlayers);
  const teamBTop = getTopPlayer(teamBPlayers);

  const isCompleted = match.status === "Completed";

  return (
    <div
      className="match-card-premium"
      onClick={() => navigate(`/matches/${match._id}`)}
    >
      <div className="card-status-pill">{match.status}</div>
      
      <div className="match-card-content">
        <div className="teams-score-battle">
          <div className="team-score-box">
            <span className="team-abbr">{match.teamA}</span>
            <span className={`score-display ${match.winner === match.teamA ? 'winner-text' : ''}`}>
              {match.scoreA || "0/0"}
            </span>
          </div>
          
          <div className="vs-divider-small">VS</div>
          
          <div className="team-score-box">
            <span className={`score-display ${match.winner === match.teamB ? 'winner-text' : ''}`}>
              {match.scoreB || "0/0"}
            </span>
            <span className="team-abbr">{match.teamB}</span>
          </div>
        </div>

        {isCompleted && match.winner && (
          <div className="winner-announcement-pill">
             🏆 {match.winner.toUpperCase()} WON
          </div>
        )}

        {!isCompleted && (
          <div className="top-performers-row">
            {teamATop && (
              <div className="performer-mini">
                <span className="performer-name">{teamATop.name.split(' ')[0]}</span>
                <span className="performer-stat">{teamATop.runs}*</span>
              </div>
            )}
            <div className="performer-divider">|</div>
            {teamBTop && (
              <div className="performer-mini">
                <span className="performer-name">{teamBTop.name.split(' ')[0]}</span>
                <span className="performer-stat">{teamBTop.runs}*</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card-footer-action">
        EXPLORE FULL MATCH ANALYSIS →
      </div>
    </div>
  );
}

export default MatchCard;