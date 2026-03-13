import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddPlayer() {
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    role: "Batsman",
    image: "",
    nationality: "Indian",
    dob: "",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm Fast",
    jerseyNumber: "",
    // T20I (Root fields)
    matches: "",
    runs: "",
    wickets: "",
    battingAvg: "",
    strikeRate: "",
    bowlingEcon: "",
    highScore: "",
    bestBowling: "",
    fifties: "",
    hundreds: "",
    // ODI
    odi: { matches: "", runs: "", avg: "", sr: "", hundreds: "", fifties: "", wickets: "", best: "" },
    // Test
    test: { matches: "", runs: "", avg: "", sr: "", hundreds: "", fifties: "", wickets: "", best: "" },
    description: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Player Data:", formData);
    try {
      await API.post("/players", formData);
      alert("Player added successfully!");
      navigate("/players");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add player");
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Add New Professional Player</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <h3 style={{ gridColumn: 'span 2', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Basic Information</h3>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Player Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name (e.g., Virat Kohli)" />
        </div>
        <div className="input-group">
          <label>Team</label>
          <input type="text" name="team" value={formData.team} onChange={handleChange} required placeholder="e.g., India" />
        </div>
        <div className="input-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicketkeeper">Wicketkeeper</option>
          </select>
        </div>
        <div className="input-group">
          <label>Image URL (Optional)</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
        </div>
        <div className="input-group">
          <label>Nationality</label>
          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Date of Birth</label>
          <input type="text" name="dob" value={formData.dob} onChange={handleChange} placeholder="e.g., Nov 05, 1988" />
        </div>
        <div className="input-group">
          <label>Jersey Number</label>
          <input type="text" name="jerseyNumber" value={formData.jerseyNumber} onChange={handleChange} placeholder="e.g., 18" />
        </div>

        <h3 style={{ gridColumn: 'span 2', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '20px' }}>T20I Statistics</h3>
        <div className="input-group"><label>Matches</label><input type="number" name="matches" value={formData.matches} onChange={handleChange} /></div>
        <div className="input-group"><label>Runs</label><input type="number" name="runs" value={formData.runs} onChange={handleChange} /></div>
        <div className="input-group"><label>Avg</label><input type="number" step="0.01" name="battingAvg" value={formData.battingAvg} onChange={handleChange} /></div>
        <div className="input-group"><label>SR</label><input type="number" step="0.01" name="strikeRate" value={formData.strikeRate} onChange={handleChange} /></div>

        <h3 style={{ gridColumn: 'span 2', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '20px' }}>ODI Statistics</h3>
        <div className="input-group"><label>Matches</label><input type="number" name="odi.matches" value={formData.odi.matches} onChange={handleChange} /></div>
        <div className="input-group"><label>Runs</label><input type="number" name="odi.runs" value={formData.odi.runs} onChange={handleChange} /></div>
        <div className="input-group"><label>Avg</label><input type="number" step="0.01" name="odi.avg" value={formData.odi.avg} onChange={handleChange} /></div>
        <div className="input-group"><label>SR</label><input type="number" step="0.01" name="odi.sr" value={formData.odi.sr} onChange={handleChange} /></div>

        <h3 style={{ gridColumn: 'span 2', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '20px' }}>Test Statistics</h3>
        <div className="input-group"><label>Matches</label><input type="number" name="test.matches" value={formData.test.matches} onChange={handleChange} /></div>
        <div className="input-group"><label>Runs</label><input type="number" name="test.runs" value={formData.test.runs} onChange={handleChange} /></div>
        <div className="input-group"><label>Avg</label><input type="number" step="0.01" name="test.avg" value={formData.test.avg} onChange={handleChange} /></div>
        <div className="input-group"><label>SR</label><input type="number" step="0.01" name="test.sr" value={formData.test.sr} onChange={handleChange} /></div>

        <div className="input-group" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '100px' }} placeholder="Tell something about the player..."></textarea>
        </div>
        <button type="submit" className="auth-btn" style={{ gridColumn: 'span 2' }}>Save Professional Profile</button>
      </form>
    </div>
  );
}

export default AddPlayer;