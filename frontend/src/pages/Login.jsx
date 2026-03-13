import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("LOGIN BUTTON CLICKED");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      console.log("LOGIN RESPONSE RECEIVED:", data);
      
      if (data.otpRequired) {
        console.log("REDIRECTING TO OTP PAGE...");
        navigate("/verify-otp", { state: { email: data.email } });
      } else if (data.token) {
        console.warn("2FA BYPASSED: Backend returned token directly. Redirecting to dashboard...");
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/dashboard");
        window.location.reload();
      } else {
        setError("Incomplete response from server");
      }
    } catch (err) {
      console.error("LOGIN API ERROR:", err);
      setError(err.response?.data?.message || "Something went wrong");
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
          <p>Login to continue</p>
        </div>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input 
              type="text" 
              placeholder="Email or Username" 
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
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="auth-footer">
          <Link to="/forgot-password" className="footer-link">Forgot Password?</Link>
          <Link to="/register" className="footer-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;