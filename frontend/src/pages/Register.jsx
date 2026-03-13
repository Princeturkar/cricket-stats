import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/register", { username, email, password });
      alert(response.data.message);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Registration failed");
      } else if (err.request) {
        setError("Network error: Server is unresponsive");
      } else {
        setError("An error occurred during registration");
      }
    }
  };

  return (
    <div className="auth-container" style={{
      backgroundImage: "url('/stadium.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="stadium-background"></div>
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏏 Cricket Arena</h1>
          <p>Create your account</p>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn">Sign Up</button>
        </form>
        <div className="auth-footer">
          <Link to="/login" className="footer-link">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;