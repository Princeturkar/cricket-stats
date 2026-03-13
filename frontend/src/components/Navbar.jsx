import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfoRaw = localStorage.getItem("userInfo");
  const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navLinksRef = useRef(null);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (!navLinksRef.current) return;
      
      const activeLink = navLinksRef.current.querySelector(".nav-link.active");
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        
        // Prevent infinite loop by checking if values actually changed
        setIndicatorStyle(prev => {
          if (prev.left === `${offsetLeft}px` && prev.width === `${offsetWidth}px` && prev.opacity === 1) {
            return prev;
          }
          return {
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
            opacity: 1
          };
        });
      } else {
        setIndicatorStyle(prev => {
          if (prev.opacity === 0) return prev;
          return { opacity: 0 };
        });
      }
    };

    updateIndicator();
    // Re-run on window resize
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location.pathname, userInfoRaw]); // Use the raw string as dependency to avoid object reference issues

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="nav-links" ref={navLinksRef} style={{ position: 'relative' }}>
        <Link to="/dashboard" className="nav-brand">
          🏏 CricStats
        </Link>
        
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
          🏠 Home
        </Link>
        <Link to="/matches" className={`nav-link ${isActive("/matches")}`}>
          📅 Matches
        </Link>
        <Link to="/players" className={`nav-link ${isActive("/players")}`}>
          👥 Players
        </Link>
        <Link to="/standings" className={`nav-link ${isActive("/standings")}`}>
          📊 Standings
        </Link>
        <Link to="/stats" className={`nav-link ${isActive("/stats")}`}>
          📈 Stats
        </Link>
        <Link to="/rankings" className={`nav-link ${isActive("/rankings")}`}>
          🏆 Rankings
        </Link>
        <Link to="/compare" className={`nav-link ${isActive("/compare")}`}>
          ⚖️ Compare
        </Link>
        
        {userInfo && (
          <>
            <Link to="/add-match" className={`nav-link ${isActive("/add-match")}`}>
              ➕ Add Match
            </Link>
            <Link to="/add-player" className={`nav-link ${isActive("/add-player")}`}>
              👤 Add Player
            </Link>
            <Link to="/chat" className={`nav-link ${isActive("/chat")}`} style={{ color: "#a855f7" }}>
              🤖 Chat
            </Link>
            <Link to="/sync-matches" className={`nav-link ${isActive("/sync-matches")}`} style={{ color: "#22c55e" }}>
              📡 Sync
            </Link>
          </>
        )}
        
        {/* Sliding Indicator */}
        <div className="nav-indicator" style={indicatorStyle} />
      </div>

      <div className="nav-actions">
        {userInfo ? (
          <>
            {userInfo.isAdmin && (
              <Link to="/admin" className="admin-badge">
                Admin
              </Link>
            )}
            <span className="user-greeting">
              Hi, <strong>{userInfo.username}</strong>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;