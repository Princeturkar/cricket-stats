import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import API from "../services/api";

function Standings({ defaultTab = "standings" }) {
  const { setTheme } = useOutletContext();
  const [data, setData] = useState({ standings: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [statType, setStatType] = useState("mostRuns");
  const [format, setFormat] = useState("t20i");

  useEffect(() => {
    if (setTheme) setTheme(format);
  }, [format, setTheme]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/matches/standings");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching standings:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error) return <div className="page"><p style={{ color: "red" }}>Error: {error}</p></div>;

  const { standings = [], stats = {} } = data && !Array.isArray(data) ? data : { standings: Array.isArray(data) ? data : [], stats: {} };

  const renderStatsTable = () => {
    const rawList = stats[statType];
    const list = Array.isArray(rawList) ? rawList : [];
    const isBatting = statType === "mostRuns";

    return (
      <div className="standings-container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>{isBatting ? "Most Runs" : "Most Wickets"}</h3>
          <select 
            value={statType} 
            onChange={(e) => setStatType(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              background: '#222', 
              color: 'white', 
              border: '1px solid #444', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <option value="mostRuns">Most Runs</option>
            <option value="mostWickets">Most Wickets</option>
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="standings-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Pos</th>
                <th>Player</th>
                <th style={{ textAlign: 'center' }}>{isBatting ? "R" : "W"}</th>
                <th style={{ textAlign: 'center' }}>Mat</th>
                <th style={{ textAlign: 'center' }}>Avg</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 'bold', color: '#999' }}>{index + 1}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{item.player}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase' }}>{item.team}</div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: isBatting ? '#00ff88' : '#ff4d4d' }}>
                    {isBatting ? item.runs : item.wickets}
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.matches}</td>
                  <td style={{ textAlign: 'center' }}>
                    {item.matches > 0 ? ((isBatting ? item.runs : item.wickets) / item.matches).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No player data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="standings-page-wrapper" data-theme={format}>
      <div className="page">

      <div className="tabs" style={{ display: 'flex', gap: '15px', marginBottom: '30px', paddingBottom: '15px' }}>
        <button 
          onClick={() => setActiveTab('standings')}
          style={{ 
            padding: '12px 25px', 
            background: activeTab === 'standings' ? 'var(--accent-glow, rgba(0, 242, 255, 0.1))' : 'transparent', 
            color: activeTab === 'standings' ? 'var(--accent, var(--neon-cyan))' : 'rgba(255, 255, 255, 0.5)', 
            border: activeTab === 'standings' ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'standings' ? '0 0 15px var(--accent-glow)' : 'none'
          }}
        >
          Points Table
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          style={{ 
            padding: '12px 25px', 
            background: activeTab === 'stats' ? 'var(--accent-glow, rgba(0, 242, 255, 0.1))' : 'transparent', 
            color: activeTab === 'stats' ? 'var(--accent, var(--neon-cyan))' : 'rgba(255, 255, 255, 0.5)', 
            border: activeTab === 'stats' ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'stats' ? '0 0 15px var(--accent-glow)' : 'none'
          }}
        >
          Tournament Stats
        </button>
      </div>

      {activeTab === 'stats' ? (
        <div className="stats-section">
          <h2>Tournament Statistics</h2>
          
          <div className="stats-highlights" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {/* Highest Team Score */}
            <div className="standings-container" style={{ margin: 0, padding: '20px', textAlign: 'center', borderTopColor: 'var(--accent, var(--cyan))' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#999', fontSize: '0.9rem', textTransform: 'uppercase' }}>Highest Team Score</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--accent, var(--cyan))' }}>{stats?.highestTeamScore?.score || 0}</p>
              <p style={{ fontSize: '1rem', margin: '5px 0', fontWeight: '600' }}>{stats?.highestTeamScore?.team || 'N/A'}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '5px 0' }}>Against {stats?.highestTeamScore?.against || 'N/A'}</p>
              {stats?.highestTeamScore?.matchId && (
                <Link to={`/matches/${stats.highestTeamScore.matchId}`} style={{ color: 'var(--accent, var(--cyan))', fontSize: '0.8rem', textDecoration: 'none', border: '1px solid var(--accent, var(--cyan))', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Match</Link>
              )}
            </div>

            {/* Most Runs Aggregate */}
            <div className="standings-container" style={{ margin: 0, padding: '20px', textAlign: 'center', borderTopColor: 'var(--accent, #00ff88)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#999', fontSize: '0.9rem', textTransform: 'uppercase' }}>Most Runs (Top)</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--accent, #00ff88)' }}>{Array.isArray(stats?.mostRuns) && stats.mostRuns.length > 0 ? stats.mostRuns[0].runs : 0}</p>
              <p style={{ fontSize: '1.1rem', margin: '10px 0', fontWeight: '700' }}>{Array.isArray(stats?.mostRuns) && stats.mostRuns.length > 0 ? stats.mostRuns[0].player : 'N/A'}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{Array.isArray(stats?.mostRuns) && stats.mostRuns.length > 0 ? stats.mostRuns[0].matches : 0} Matches Played</p>
            </div>

            {/* Most Wickets Aggregate */}
            <div className="standings-container" style={{ margin: 0, padding: '20px', textAlign: 'center', borderTopColor: 'var(--accent, #ff4d4d)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#999', fontSize: '0.9rem', textTransform: 'uppercase' }}>Most Wickets (Top)</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--accent, #ff4d4d)' }}>{Array.isArray(stats?.mostWickets) && stats.mostWickets.length > 0 ? stats.mostWickets[0].wickets : 0}</p>
              <p style={{ fontSize: '1.1rem', margin: '10px 0', fontWeight: '700' }}>{Array.isArray(stats?.mostWickets) && stats.mostWickets.length > 0 ? stats.mostWickets[0].player : 'N/A'}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{Array.isArray(stats?.mostWickets) && stats.mostWickets.length > 0 ? stats.mostWickets[0].matches : 0} Matches Played</p>
            </div>

            {/* Best Individual Score */}
            <div className="standings-container" style={{ margin: 0, padding: '20px', textAlign: 'center', borderTopColor: 'var(--accent, #ffc107)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#999', fontSize: '0.9rem', textTransform: 'uppercase' }}>Best Individual Score</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--accent, #ffc107)' }}>{stats?.bestIndividualScore?.runs || 0}</p>
              <p style={{ fontSize: '1.1rem', margin: '5px 0', fontWeight: '700' }}>{stats?.bestIndividualScore?.player || 'N/A'}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '5px 0' }}>Team: {stats?.bestIndividualScore?.team || 'N/A'}</p>
              {stats?.bestIndividualScore?.matchId && (
                <Link to={`/matches/${stats.bestIndividualScore.matchId}`} style={{ color: 'var(--accent, #ffc107)', fontSize: '0.8rem', textDecoration: 'none', border: '1px solid var(--accent, #ffc107)', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Match</Link>
              )}
            </div>

            {/* Best Bowling Figures */}
            <div className="standings-container" style={{ margin: 0, padding: '20px', textAlign: 'center', borderTopColor: '#e91e63' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#999', fontSize: '0.9rem', textTransform: 'uppercase' }}>Best Bowling Figure</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: '#e91e63' }}>{stats?.bestBowlingFigure?.wickets || 0} Wkts</p>
              <p style={{ fontSize: '1.1rem', margin: '5px 0', fontWeight: '700' }}>{stats?.bestBowlingFigure?.player || 'N/A'}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '5px 0' }}>Team: {stats?.bestBowlingFigure?.team || 'N/A'}</p>
              {stats?.bestBowlingFigure?.matchId && (
                <Link to={`/matches/${stats.bestBowlingFigure.matchId}`} style={{ color: '#e91e63', fontSize: '0.8rem', textDecoration: 'none', border: '1px solid #e91e63', padding: '4px 10px', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Match</Link>
              )}
            </div>
          </div>

          {/* Full Stats Table */}
          {renderStatsTable()}
        </div>
      ) : (
        <div className="standings-section">
          <h2>Tournament Standings</h2>
          <div className="standings-container">
            <div style={{ overflowX: 'auto' }}>
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>L</th>
                    <th>T</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => (
                    <tr key={index}>
                      <td className="team-name">{row.team}</td>
                      <td>{row.played}</td>
                      <td>{row.won}</td>
                      <td>{row.lost}</td>
                      <td>{row.tied}</td>
                      <td className="points-cell">{row.points}</td>
                    </tr>
                  ))}
                  {standings.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        No match data available to calculate standings.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Standings;
