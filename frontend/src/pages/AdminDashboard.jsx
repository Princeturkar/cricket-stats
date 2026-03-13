
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ matches: 0, players: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [m, p] = await Promise.all([
        API.get("/matches"),
        API.get("/players")
      ]);
      setStats({
        matches: m.data.length,
        players: p.data.length
      });
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <span className="admin-subtitle">COMMAND CENTER</span>
        <h2>SYSTEM OVERRIDE</h2>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="status-indicator"></div>
          <div className="card-stat-count">{stats.matches}</div>
          <h3>MATCH ENGINE</h3>
          <p>Initialize new match instances and update live scoreboards across the network.</p>
          <Link to="/add-match" className="admin-btn">
            <span className="btn-icon">⚡</span> CONFIGURE MATCH
          </Link>
        </div>

        <div className="admin-card">
          <div className="status-indicator"></div>
          <div className="card-stat-count">{stats.players}</div>
          <h3>PLAYER ROSTER</h3>
          <p>Sync player profiles, update career statistics, and manage the elite rankings database.</p>
          <div className="admin-actions-row">
            <Link to="/add-player" className="admin-btn">
              <span className="btn-icon">👤</span> ADD PLAYER
            </Link>
            <button className="admin-btn" onClick={() => alert("Database Sync Initialized...")}>
              <span className="btn-icon">🔄</span> SYNC
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;