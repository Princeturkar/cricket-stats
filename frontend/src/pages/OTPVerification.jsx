import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setMessage("Login successful! Redirecting to home...");
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload(); // Ensure Navbar updates with user info
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await API.post("/auth/resend-otp", { email });
      setMessage("OTP resent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
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
          <p>Verify your account</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>We've sent an OTP to <strong>{email}</strong></p>
        </div>
        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg" style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
        
        <form onSubmit={handleVerify}>
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
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        
        <div className="auth-footer">
          <button onClick={handleResend} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }} disabled={loading}>
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
