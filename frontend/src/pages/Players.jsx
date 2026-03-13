import { useEffect, useState } from "react";
import API from "../services/api";
import PlayerCard from "../components/PlayerCard";


function Players() {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = () => {
    API.get("/players").then(res => setPlayers(res.data));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = (id) => {
    API.delete(`/players/${id}`)
      .then(() => {
        setPlayers(prev => prev.filter(p => p._id !== id));
      })
      .catch(err => {
        console.error("Delete failed:", err);
        alert("Failed to delete player. Check console for details.");
      });
  };

  return (
    <div className="page">
      <h2>Featured Players</h2>
      <div className="players-grid">
        {players.length > 0 ? (
          players.map(player => (
            <PlayerCard key={player._id} player={player} onDelete={handleDelete} />
          ))
        ) : (
          <p>No players found.</p>
        )}
      </div>
    </div>
  );
}

export default Players;