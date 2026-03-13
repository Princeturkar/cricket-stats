import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
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
          <p>Create new password</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Resetting for <strong>{email}</strong></p>
        </div>
        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg" style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
        
        <form onSubmit={handleReset}>
          <div className="input-group">
            <span className="input-icon">🔑</span>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              maxLength="6"
              required 
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        
        <div className="auth-footer">
          <Link to="/login" className="footer-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
