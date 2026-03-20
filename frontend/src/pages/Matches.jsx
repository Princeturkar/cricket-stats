import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../services/api";
import MatchCard from "../components/MatchCard";

const socket = io(process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:5000");

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await API.get("/matches");
        console.log("Matches fetched:", res.data);
        setMatches(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError(err.message);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    socket.on("matchUpdated", (updatedMatch) => {
      setMatches((prevMatches) =>
        prevMatches.map((m) => (m._id === updatedMatch._id ? updatedMatch : m))
      );
    });

    return () => {
      socket.off("matchUpdated");
    };
  }, []);

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete ALL matches? This cannot be undone.")) {
      try {
        await API.post("/matches/delete-all-matches");
        setMatches([]);
        alert("All matches deleted successfully");
      } catch (err) {
        console.error("Error deleting matches:", err);
        alert("Failed to delete matches: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Live Matches</h2>
        {matches.length > 0 && (
          <button 
            onClick={handleDeleteAll}
            style={{ 
              background: '#ff4d4d', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Clear All Matches
          </button>
        )}
      </div>
      
      {loading && <p style={{ textAlign: 'center', color: '#666' }}>Loading matches...</p>}
      
      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}
      
      <div className="matches-grid">
        {!loading && matches.length > 0 ? (
          matches.map(match => (
            <MatchCard key={match._id} match={match} />
          ))
        ) : !loading ? (
          <p style={{ textAlign: 'center', color: '#999', gridColumn: '1/-1' }}>No matches available at the moment.</p>
        ) : null}
      </div>
      
      {!loading && <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '20px' }}>Total matches: {matches.length}</p>}
    </div>
  );
}

export default Matches;