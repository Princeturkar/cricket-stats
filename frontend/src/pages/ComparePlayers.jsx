import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import API from "../services/api";
import "../styles/ComparePlayers.css";

function ComparePlayers() {
  const { setTheme } = useOutletContext();
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [format, setFormat] = useState("t20i");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (setTheme) setTheme(format);
  }, [format, setTheme]);

  useEffect(() => {
    API.get("/players").then((res) => setPlayers(res.data));
  }, []);

  useEffect(() => {
    if (player1 && player2) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [player1, player2, format]);

  const handleSelect1 = (e) => {
    const player = players.find((p) => p._id === e.target.value);
    setPlayer1(player);
  };

  const handleSelect2 = (e) => {
    const player = players.find((p) => p._id === e.target.value);
    setPlayer2(player);
  };

  const getFormatStats = (player, f) => {
    if (!player) return {};
    if (f === "t20i") {
      return {
        runs: player.runs || 0,
        avg: player.battingAvg || 0,
        sr: player.strikeRate || 0,
        matches: player.matches || 0,
        highScore: player.highScore || 0,
        wickets: player.wickets || 0
      };
    }
    const stats = player[f] || {};
    return {
      runs: stats.runs || 0,
      avg: stats.avg || 0,
      sr: stats.sr || 0,
      matches: stats.matches || 0,
      highScore: stats.highScore || 0,
      wickets: stats.wickets || 0
    };
  };

  const getWinner = (p1, p2, f) => {
    const s1 = getFormatStats(p1, f);
    const s2 = getFormatStats(p2, f);

    const metrics = [
      { v1: s1.runs, v2: s2.runs },
      { v1: s1.avg, v2: s2.avg },
      { v1: s1.sr, v2: s2.sr },
      { v1: s1.matches, v2: s2.matches },
      { v1: s1.highScore, v2: s2.highScore },
      { v1: s1.wickets, v2: s2.wickets }
    ];

    let p1Wins = 0, p2Wins = 0;

    metrics.forEach(metric => {
      if (metric.v1 > metric.v2) p1Wins++;
      else if (metric.v2 > metric.v1) p2Wins++;
    });

    if (p1Wins > p2Wins) return { winner: p1.name, winnerId: 1 };
    if (p2Wins > p1Wins) return { winner: p2.name, winnerId: 2 };
    return { winner: "Tie", winnerId: 0 };
  };

  const StatRow = ({ label, val1, val2, index }) => {
    const maxVal = Math.max(val1, val2) || 1;
    const pct1 = (val1 / maxVal) * 100;
    const pct2 = (val2 / maxVal) * 100;

    return (
      <div className="compare-stat-row magnetic-row" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="stat-power-container p1-side">
          <div className={`stat-val ${val1 > val2 ? 'winner' : ''}`}>
            {val1 % 1 !== 0 ? val1.toFixed(2) : val1}
          </div>
          <div className="power-bar-wrapper">
            <div 
              className={`power-bar ${val1 > val2 ? 'winner-bar' : ''}`} 
              style={{ width: `${pct1}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-center-meta">
          <div className="stat-label">{label}</div>
          <div className="stat-diff-badge">
            {val1 > val2 ? `+${(val1 - val2).toFixed(1)}` : (val2 > val1 ? `+${(val2 - val1).toFixed(1)}` : '0')}
          </div>
        </div>

        <div className="stat-power-container p2-side">
          <div className="power-bar-wrapper">
            <div 
              className={`power-bar ${val2 > val1 ? 'winner-bar' : ''}`} 
              style={{ width: `${pct2}%` }}
            ></div>
          </div>
          <div className={`stat-val ${val2 > val1 ? 'winner' : ''}`}>
            {val2 % 1 !== 0 ? val2.toFixed(2) : val2}
          </div>
        </div>
      </div>
    );
  };

  const stats1 = getFormatStats(player1, format);
  const stats2 = getFormatStats(player2, format);

  return (
    <div className="compare-page-container" data-theme={format}>
      <div className="compare-hero">
        <div className="hero-content">
          <h1>PLAYER <span className="vs-glow">VS</span> COMPARISON</h1>
          <p>Analyze and compare player performance across formats</p>
        </div>
        <div className="compare-hero-glow"></div>
      </div>

      <div className="format-selector-container">
        {['t20i', 'odi', 'test', 'ipl'].map((f) => (
          <button 
            key={f}
            className={`format-btn ${format === f ? 'active' : ''}`}
            onClick={() => setFormat(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="compare-selectors-wrapper">
        <div className="selector-box p1-selector">
          <label>PLAYER 1</label>
          <div className="select-glow">
            <select onChange={handleSelect1} value={player1?._id || ""}>
              <option value="">Choose Player</option>
              {players.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="compare-vs-badge">VS</div>

        <div className="selector-box p2-selector">
          <label>PLAYER 2</label>
          <div className="select-glow">
            <select onChange={handleSelect2} value={player2?._id || ""}>
              <option value="">Choose Player</option>
              {players.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {player1 && player2 ? (
        <div className={`compare-results-section ${isVisible ? 'fade-in' : ''}`}>
          <div className="battle-card arena-battle-card">
            <div className="battle-header arena-header">
              <div className="elite-battle-card p1-battle-card">
                <div className="player-avatar-large">{player1.name.charAt(0)}</div>
                <div className="player-battle-meta">
                  <div className="player-rank-mini">#1 RANKED</div>
                  <h3>{player1.name.toUpperCase()}</h3>
                  <span className="team-badge">{player1.team}</span>
                </div>
                <div className="card-border-glow"></div>
              </div>
              
              <div className="battle-vs-kinetic">
                <div className="vs-pulse">VS</div>
                <div className="vs-lightning">⚡</div>
              </div>

              <div className="elite-battle-card p2-battle-card">
                <div className="player-battle-meta">
                  <div className="player-rank-mini">CHALLENGER</div>
                  <h3>{player2.name.toUpperCase()}</h3>
                  <span className="team-badge">{player2.team}</span>
                </div>
                <div className="player-avatar-large">{player2.name.charAt(0)}</div>
                <div className="card-border-glow"></div>
              </div>
            </div>

            <div className="battle-stats-grid arena-grid">
              <StatRow index={0} label="Runs" val1={stats1.runs} val2={stats2.runs} />
              <StatRow index={1} label="Average" val1={stats1.avg} val2={stats2.avg} />
              <StatRow index={2} label="Strike Rate" val1={stats1.sr} val2={stats2.sr} />
              <StatRow index={3} label="Matches" val1={stats1.matches} val2={stats2.matches} />
              <StatRow index={4} label="Highest Score" val1={stats1.highScore} val2={stats2.highScore} />
              <StatRow index={5} label="Wickets" val1={stats1.wickets} val2={stats2.wickets} />
            </div>
          </div>

          <div className="comparison-winner-reveal cinematic-reveal">
            {(() => {
              const result = getWinner(player1, player2, format);
              if (result.winnerId === 0) {
                return (
                  <div className="winner-result tie-result arena-glass">
                    <div className="winner-icon-glow">🤝</div>
                    <div className="verdict-label">FINAL VERDICT</div>
                    <h2>EQUALLY LEGENDARY</h2>
                    <p>Both icons share the peak in {format.toUpperCase()}</p>
                  </div>
                );
              } else {
                const winner = result.winnerId === 1 ? player1 : player2;
                return (
                  <div className={`winner-result winner-${result.winnerId}-result arena-glass`}>
                    <div className="verdict-label">{format.toUpperCase()} SUPREMACY</div>
                    <div className="winner-name-reveal">
                        <span className="trophy-kinetic">🏆</span>
                        <h2>{winner.name.toUpperCase()}</h2>
                    </div>
                    <div className="dominance-meter">DOMINATES {format.toUpperCase()} FORMAT</div>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      ) : (
        <div className="compare-placeholder">
          <div className="placeholder-icon">⚖️</div>
          <p>SELECT TWO PLAYERS TO START THE ANALYTICAL BATTLE</p>
        </div>
      )}
    </div>
  );
}

export default ComparePlayers;