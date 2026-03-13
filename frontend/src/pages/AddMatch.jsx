import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/AddMatch.css";

function AddMatch() {
  const [formData, setFormData] = useState({
    teamA: "",
    teamB: "",
    scoreA: "0/0",
    scoreB: "0/0",
    overs: "0.0",
    status: "Upcoming",
    winner: "",
    winType: "",
    winMargin: "",
    manOfMatch: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        teamA: formData.teamA,
        teamB: formData.teamB,
        scoreA: formData.scoreA,
        scoreB: formData.scoreB,
        overs: formData.overs,
        status: formData.status
      };
      
      if (formData.winner) dataToSend.winner = formData.winner;
      if (formData.winType) dataToSend.winType = formData.winType;
      if (formData.winMargin) dataToSend.winMargin = parseInt(formData.winMargin);
      if (formData.manOfMatch) dataToSend.manOfMatch = formData.manOfMatch;
      
      const res = await API.post("/matches", dataToSend);
      alert("Match created! Now add players to it.");
      navigate(`/matches/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add match");
    }
  };

  return (
    <div className="add-match-container">
      <div className="auth-card">
        <h2>Add New Match</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Team A</label>
            <input 
              type="text" 
              name="teamA" 
              value={formData.teamA} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Team B</label>
            <input type="text" name="teamB" value={formData.teamB} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Score A (e.g., 150/3)</label>
            <input type="text" name="scoreA" value={formData.scoreA} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Score B (e.g., 140/5)</label>
            <input type="text" name="scoreB" value={formData.scoreB} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Overs (e.g., 18.2)</label>
            <input type="text" name="overs" value={formData.overs} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="input-group">
            <label>Winner (Optional)</label>
            <select name="winner" value={formData.winner} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="">Select Winner</option>
              <option value={formData.teamA}>{formData.teamA || "Team A"}</option>
              <option value={formData.teamB}>{formData.teamB || "Team B"}</option>
            </select>
          </div>

          <div className="input-group">
            <label>Win Type (Optional)</label>
            <select name="winType" value={formData.winType} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="">Select Win Type</option>
              <option value="by runs">By Runs</option>
              <option value="by wickets">By Wickets</option>
            </select>
          </div>

          <div className="input-group">
            <label>Win Margin (Optional)</label>
            <input 
              type="number" 
              name="winMargin" 
              value={formData.winMargin} 
              onChange={handleChange}
              placeholder="e.g., 5 for 5 runs or 3 for 3 wickets"
            />
          </div>

          <div className="input-group">
            <label>Man of the Match (Optional)</label>
            <input 
              type="text" 
              name="manOfMatch" 
              value={formData.manOfMatch} 
              onChange={handleChange}
              placeholder="Enter player name"
            />
          </div>

          <button type="submit" className="auth-btn" style={{ marginTop: '20px' }}>Create Match</button>
        </form>
      </div>
    </div>
  );
}

export default AddMatch;