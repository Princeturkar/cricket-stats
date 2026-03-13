import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SyncMatches() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);

  const syncAllMatches = async () => {
    setLoading(true);
    setMessage("Fetching matches from CricAPI...");
    try {
      const res = await API.get("/external/cricapi/matches");
      setMatches(res.data.data || []);
      setMessage(res.data.message || "Matches synced successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to sync matches");
    }
    setLoading(false);
  };

  const syncLiveMatches = async () => {
    setLoading(true);
    setMessage("Fetching live matches from CricAPI...");
    try {
      const res = await API.get("/external/cricapi/live-matches");
      setMatches(res.data.data || []);
      setMessage(res.data.message || "Live matches synced successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to sync live matches");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="admin-container">
        <h2>Sync Matches from CricAPI</h2>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Note:</strong> Make sure you have your CricAPI key set in the backend .env file as <code>CRICAPI_KEY</code>
          </p>
          <p style={{ margin: '0' }}>
            Get your free API key at: <a href="https://cricketdata.org" target="_blank" rel="noopener noreferrer">cricketdata.org</a>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <button
            onClick={syncAllMatches}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {loading ? "Syncing..." : "Sync Live & Completed Matches"}
          </button>

          <button
            onClick={syncLiveMatches}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {loading ? "Syncing..." : "Sync Live Matches Only"}
          </button>
        </div>

        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '15px',
            backgroundColor: message.includes("Failed") ? '#ffebee' : '#e8f5e9',
            color: message.includes("Failed") ? '#c62828' : '#2e7d32',
            borderRadius: '4px',
            borderLeft: `4px solid ${message.includes("Failed") ? '#c62828' : '#2e7d32'}`
          }}>
            {message}
          </div>
        )}

        {matches.length > 0 && (
          <div>
            <h3>Synced Matches ({matches.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Team A</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Team B</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Score A</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Score B</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Overs</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr
                      key={match._id}
                      onClick={() => navigate(`/matches/${match._id}`)}
                      style={{
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '10px' }}>{match.teamA}</td>
                      <td style={{ padding: '10px' }}>{match.teamB}</td>
                      <td style={{ padding: '10px' }}>{match.scoreA}</td>
                      <td style={{ padding: '10px' }}>{match.scoreB}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: match.status === 'Live' ? '#ff9800' : '#2196f3',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {match.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{match.overs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SyncMatches;
