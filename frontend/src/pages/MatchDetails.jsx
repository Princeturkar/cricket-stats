import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/MatchDetails.css";

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTeam, setActiveTeam] = useState(null);
  const [manualPlayer, setManualPlayer] = useState({
    name: "",
    role: ""
  });
  const [playerStats, setPlayerStats] = useState({
    runs: "",
    wickets: "",
    ballsFaced: "",
    strikeRate: "",
    battingAvg: ""
  });
  const [error, setError] = useState("");
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [resultData, setResultData] = useState({
    winner: "",
    winType: "",
    winMargin: "",
    manOfMatch: ""
  });

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const res = await API.get(`/matches/${id}`);
        setMatch(res.data);
      } catch (error) {
        console.error("Error fetching match details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  useEffect(() => {
    if (match) {
      setResultData({
        winner: match.winner || "",
        winType: match.winType || "",
        winMargin: match.winMargin || "",
        manOfMatch: match.manOfMatch || ""
      });
    }
  }, [match]);



  const handleResultChange = (e) => {
    const { name, value } = e.target;
    setResultData({
      ...resultData,
      [name]: value
    });
  };

  const handleSaveResult = async () => {
    try {
      const updateData = {
        winner: resultData.winner || null,
        winType: resultData.winType || null,
        winMargin: resultData.winMargin !== "" ? parseInt(resultData.winMargin) : null,
        manOfMatch: resultData.manOfMatch || null
      };
      await API.put(`/matches/${id}`, updateData);
      const fetchRes = await API.get(`/matches/${id}`);
      setMatch(fetchRes.data);
      setResultData({
        winner: fetchRes.data.winner || "",
        winType: fetchRes.data.winType || "",
        winMargin: fetchRes.data.winMargin || "",
        manOfMatch: fetchRes.data.manOfMatch || ""
      });
      setIsEditingResult(false);
      alert("Match result updated successfully!");
    } catch (err) {
      setError("Failed to update match result");
      console.error("Error saving result:", err);
    }
  };

  const handlePlayerStatsChange = (e) => {
    const { name, value } = e.target;
    setPlayerStats({
      ...playerStats,
      [name]: value
    });
  };

  const handleAddPlayer = async () => {
    if (!manualPlayer.name || !manualPlayer.role) {
      setError("Please enter player name and role");
      return;
    }

    const playerData = {
      name: manualPlayer.name,
      team: activeTeam,
      role: manualPlayer.role,
      runs: playerStats.runs === "" ? 0 : parseInt(playerStats.runs) || 0,
      wickets: playerStats.wickets === "" ? 0 : parseInt(playerStats.wickets) || 0,
      ballsFaced: playerStats.ballsFaced === "" ? 0 : parseInt(playerStats.ballsFaced) || 0,
      strikeRate: playerStats.strikeRate === "" ? 0 : parseFloat(playerStats.strikeRate) || 0,
      battingAvg: playerStats.battingAvg === "" ? 0 : parseFloat(playerStats.battingAvg) || 0
    };

    try {
      const updatedPlayers = [...(match.players || []), playerData];
      const res = await API.put(`/matches/${id}`, { ...match, players: updatedPlayers });
      setMatch(res.data);
      setManualPlayer({ name: "", role: "" });
      setPlayerStats({ runs: "", wickets: "", ballsFaced: "", strikeRate: "", battingAvg: "" });
      setActiveTeam(null);
      setError("");
      alert("Player added successfully!");
    } catch (err) {
      setError("Failed to add player");
      console.error(err);
    }
  };

  const handleRemovePlayer = async (index) => {
    try {
      const updatedPlayers = match.players.filter((_, i) => i !== index);
      const res = await API.put(`/matches/${id}`, { ...match, players: updatedPlayers });
      setMatch(res.data);
      alert("Player removed successfully!");
    } catch (err) {
      setError("Failed to remove player");
      console.error(err);
    }
  };

  const handlePlayerClick = async (player) => {
    try {
      const allPlayers = await API.get("/players");

      const foundPlayer = allPlayers.data.find(p =>
        p.name.toLowerCase() === player.name.toLowerCase() &&
        p.team.toLowerCase() === player.team.toLowerCase()
      );

      if (foundPlayer && foundPlayer._id) {
        navigate(`/players/${foundPlayer._id}`);
      } else {
        navigate(`/match-player/${id}/${player.name}/${player.team}`);
      }
    } catch (err) {
      console.error("Error searching for player:", err);
      navigate(`/match-player/${id}/${player.name}/${player.team}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!match) return <p>Match not found</p>;

  const teamAPlayers = match.players?.filter(p => p.team === match.teamA) || [];
  const teamBPlayers = match.players?.filter(p => p.team === match.teamB) || [];

  const PlayerStats = ({ player, onRemove, onClick }) => (
    <div className="player-stat-card player-clickable" onClick={onClick}>
      <div className="player-header">
        <div style={{ cursor: 'pointer', flex: 1 }}>
          <h4>{player.name}</h4>
          <p className="player-role">{player.role}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="remove-player-btn"
        >
          ×
        </button>
      </div>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Runs</span>
          <span className="stat-value">{player.runs}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg</span>
          <span className="stat-value">{player.battingAvg.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">SR</span>
          <span className="stat-value">{player.strikeRate.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wickets</span>
          <span className="stat-value">{player.wickets}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="match-details-page">
      <div className="match-header">
        <h2>{match.teamA} <span className="vs">vs</span> {match.teamB}</h2>
        <div className="match-score">
          <div className="team-score">
            <p className="team-name">{match.teamA}</p>
            <p className="score">{match.scoreA}</p>
          </div>
          <div className="team-score">
            <p className="team-name">{match.teamB}</p>
            <p className="score">{match.scoreB}</p>
          </div>
        </div>
        <div className="match-info">
          <p><strong>Overs:</strong> {match.overs}</p>
          <p><strong>Status:</strong> <span className={`status ${match.status}`}>{match.status}</span></p>
        </div>

        {match.status === "Completed" && (
          <div className="match-result-section">
            {isEditingResult ? (
              <div className="result-edit-form" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h4>Edit Match Result</h4>

                <div className="input-group" style={{ marginBottom: '10px' }}>
                  <label>Winner</label>
                  <select
                    name="winner"
                    value={resultData.winner}
                    onChange={handleResultChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Winner</option>
                    <option value={match.teamA}>{match.teamA}</option>
                    <option value={match.teamB}>{match.teamB}</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: '10px' }}>
                  <label>Win Type</label>
                  <select
                    name="winType"
                    value={resultData.winType}
                    onChange={handleResultChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Win Type</option>
                    <option value="by runs">By Runs</option>
                    <option value="by wickets">By Wickets</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: '10px' }}>
                  <label>Win Margin</label>
                  <input
                    type="number"
                    name="winMargin"
                    value={resultData.winMargin}
                    onChange={handleResultChange}
                    placeholder="e.g., 5 for 5 runs or 3 for 3 wickets"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label>Man of the Match</label>
                  <input
                    type="text"
                    name="manOfMatch"
                    value={resultData.manOfMatch}
                    onChange={handleResultChange}
                    placeholder="Enter player name"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleSaveResult}
                    className="save-btn"
                    style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingResult(false)}
                    className="cancel-btn"
                    style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="result-display">
                {match.winner ? (
                  <p><strong>Winner:</strong> {match.winner} {match.winType && `(${match.winType}${match.winMargin ? ` ${match.winMargin}` : ""})`}</p>
                ) : (
                  <p style={{ color: '#999' }}>No winner set yet</p>
                )}
                {match.manOfMatch ? (
                  <p><strong>Man of the Match:</strong> {match.manOfMatch}</p>
                ) : (
                  <p style={{ color: '#999' }}>No man of the match set yet</p>
                )}
                <button
                  onClick={() => setIsEditingResult(true)}
                  className="edit-result-btn"
                  style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {match.winner || match.manOfMatch ? "Edit Result" : "Add Result"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Full Match Scorecard</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{match.teamA}</h4>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: match.winner === match.teamA ? '#28a745' : '#666' }}>
                {match.scoreA}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e3f2fd', borderBottom: '2px solid #1976d2' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Player</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Runs</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>BF</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>SR</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Wkts</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {teamAPlayers.length > 0 ? (
                    teamAPlayers.map((player, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: '1px solid #ddd', cursor: 'pointer' }}
                        onClick={() => handlePlayerClick(player)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <td style={{ padding: '8px', textAlign: 'left' }}>
                          <div>
                            <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>{player.name}</p>
                            <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{player.role}</p>
                          </div>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>{player.runs}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.ballsFaced}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.strikeRate.toFixed(1)}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.wickets}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.battingAvg.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#999' }}>
                        No players added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {match.externalSource === 'manual' && (
              <button
                onClick={() => setActiveTeam(match.teamA)}
                style={{
                  marginTop: '15px',
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                + Add Player
              </button>
            )}
          </div>

          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{match.teamB}</h4>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: match.winner === match.teamB ? '#28a745' : '#666' }}>
                {match.scoreB}
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3e5f5', borderBottom: '2px solid #7b1fa2' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Player</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Runs</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>BF</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>SR</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Wkts</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {teamBPlayers.length > 0 ? (
                    teamBPlayers.map((player, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: '1px solid #ddd', cursor: 'pointer' }}
                        onClick={() => handlePlayerClick(player)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <td style={{ padding: '8px', textAlign: 'left' }}>
                          <div>
                            <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>{player.name}</p>
                            <p style={{ margin: '0', fontSize: '11px', color: '#999' }}>{player.role}</p>
                          </div>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>{player.runs}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.ballsFaced}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.strikeRate.toFixed(1)}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.wickets}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{player.battingAvg.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#999' }}>
                        No players added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {match.externalSource === 'manual' && (
              <button
                onClick={() => setActiveTeam(match.teamB)}
                style={{
                  marginTop: '15px',
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                + Add Player
              </button>
            )}
          </div>
        </div>
      </div>

      {activeTeam && (
        <div className="add-player-form-overlay">
          <div className="add-player-form">
            <h3>Add Player to {activeTeam}</h3>
            {error && <p className="error-msg">{error}</p>}

            <div className="input-group">
              <label>Player Name</label>
              <input
                type="text"
                value={manualPlayer.name}
                onChange={(e) => setManualPlayer({ ...manualPlayer, name: e.target.value })}
                placeholder="Enter player name"
              />
            </div>

            <div className="input-group">
              <label>Role</label>
              <select
                value={manualPlayer.role}
                onChange={(e) => setManualPlayer({ ...manualPlayer, role: e.target.value })}
              >
                <option value="">Select role</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-rounder">All-rounder</option>
                <option value="Wicket-keeper">Wicket-keeper</option>
              </select>
            </div>

            <div className="player-stats-grid">
              <div className="input-group">
                <label>Runs</label>
                <input type="number" name="runs" value={playerStats.runs} onChange={handlePlayerStatsChange} min="0" />
              </div>
              <div className="input-group">
                <label>Wickets</label>
                <input type="number" name="wickets" value={playerStats.wickets} onChange={handlePlayerStatsChange} min="0" />
              </div>
              <div className="input-group">
                <label>Balls Faced</label>
                <input type="number" name="ballsFaced" value={playerStats.ballsFaced} onChange={handlePlayerStatsChange} min="0" />
              </div>
              <div className="input-group">
                <label>Strike Rate</label>
                <input type="number" name="strikeRate" value={playerStats.strikeRate} onChange={handlePlayerStatsChange} step="0.01" min="0" />
              </div>
              <div className="input-group">
                <label>Batting Avg</label>
                <input type="number" name="battingAvg" value={playerStats.battingAvg} onChange={handlePlayerStatsChange} step="0.01" min="0" />
              </div>
            </div>

            <div className="form-buttons">
              <button
                onClick={handleAddPlayer}
                className="add-btn"
                disabled={!manualPlayer.name || !manualPlayer.role}
                style={{
                  opacity: (!manualPlayer.name || !manualPlayer.role) ? 0.5 : 1,
                  cursor: (!manualPlayer.name || !manualPlayer.role) ? 'not-allowed' : 'pointer'
                }}
              >
                Add Player
              </button>
              <button onClick={() => setActiveTeam(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchDetails;