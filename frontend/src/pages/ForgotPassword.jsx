import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await API.post("/auth/forgot-password", { email });
      setMessage("OTP sent to your email! Redirecting to reset page...");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <p>Reset your password</p>
        </div>
        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg" style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input 
              type="email" 
              placeholder="Enter your registered email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset OTP"}
          </button>
        </form>
        
        <div className="auth-footer">
          <Link to="/login" className="footer-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
