import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-trigger').forEach(el => observer.observe(el));
    
    // Advanced Mouse Interaction
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const tiltX = (clientY - centerY) / 50;
      const tiltY = (clientX - centerX) / 50;

      if (titleRef.current) {
        titleRef.current.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg) translateZ(50px)`;
      }

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mx', `${clientX}px`);
        containerRef.current.style.setProperty('--my', `${clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="elite-protocol-container" ref={containerRef}>
      <div className="scanline-overlay"></div>
      <div className="ui-hud-frame">
        <div className="hud-corner tl"></div>
        <div className="hud-corner tr"></div>
        <div className="hud-corner bl"></div>
        <div className="hud-corner br"></div>
        <div className="hud-coords">SYS_LAT: 34.0522 // SYS_LONG: -118.2437</div>
      </div>
      
      {/* Elite Control Hero */}
      <section className="control-hero">
        <div className="parallax-master bg-dark-stadium" style={{ 
          backgroundImage: `url('/home_bg.png')`,
          transform: `translate(${(mousePos.x - window.innerWidth/2) * -0.015}px, ${(mousePos.y - window.innerHeight/2) * -0.015}px) scale(1.05)`
        }}></div>
        
        <div className="hero-atmosphere"></div>
        
        <div className="command-center-content">
          <div className="protocol-header reveal-trigger">
            <div className="protocol-tag">
              <span className="dot pulse"></span>
              ELITE COMMAND PROTOCOL
            </div>
            
            <h1 className="protocol-title" ref={titleRef}>
              <span className="p-top">ACCESS THE</span>
              <span className="p-main">CRIC<span className="cyan-text">STATS</span> NODE</span>
            </h1>

            <p className="protocol-desc">
              Next-generation scouting interface. Real-time sensory data synchronized 
              with global cricket neural networks.
            </p>

            <div className="protocol-cta">
              <Link to="/rankings" className="btn-protocol-primary">
                <span className="b-inner">INITIALIZE DATABASE</span>
                <span className="b-scan"></span>
              </Link>
              <Link to="/compare" className="btn-protocol-secondary">
                OPEN BATTLE MODULE
              </Link>
            </div>
          </div>
        </div>

        {/* Sensory Feedback Ticker */}
        <div className="sensory-ticker">
          <div className="ticker-label">COMMAND LOG</div>
          <div className="ticker-scroll">
            {[1, 2].map((i) => (
              <div key={i} className="ticker-group">
                <div className="t-item">ROHIT.SHARMA // STATS: OPTIMAL</div>
                <div className="t-item">VIRAT.KOHLI // STATUS: LEGACY</div>
                <div className="t-item">AI_NEURAL_LINK // CONNECTED</div>
                <div className="t-item">BATTLE_ARENA // STANDBY</div>
                <div className="t-item">SCANNING_PLAYERS... 100%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Bento Grid */}
      <section className="protocol-bento-section reveal-trigger">
        <div className="protocol-section-title">
          <span className="p-sub">SELECT MODULE</span>
          <h2>KINETIC INTERFACE</h2>
        </div>

        <div className="protocol-grid">
          {/* Elite Showcase */}
          <div className="p-card card-large glass-cyber">
            <img src="/roko.jpg" alt="Elite Legends" className="p-card-img" />
            <div className="p-card-overlay">
              <span className="p-badge">LEGACY NODE</span>
              <h3>THE ROKO PROTOCOL</h3>
              <p>Advanced biomechanical analysis of contemporary greats.</p>
              <Link to="/players" className="p-card-btn">VIEW ROSTER</Link>
            </div>
            <div className="card-reflection"></div>
          </div>

          {/* AI Module */}
          <div className="p-card card-small glass-cyber ai-node">
            <div className="node-rings">
              <div className="ring r1"></div>
              <div className="ring r2"></div>
            </div>
            <div className="node-icon">🤖</div>
            <h3>AI PREDICTOR</h3>
            <p>Neural match casting.</p>
            <Link to="/chat" className="p-link">SYNC →</Link>
          </div>

          {/* Arena Module */}
          <div className="p-card card-small glass-cyber arena-node">
            <div className="arena-bg-text">FX</div>
            <div className="node-icon">⚔️</div>
            <h3>BATTLE FX</h3>
            <p>Kinetic 1v1 Arena.</p>
            <Link to="/compare" className="p-link">ENTER →</Link>
          </div>

          {/* Data Module */}
          <div className="p-card card-small glass-cyber data-node">
            <div className="node-icon">📊</div>
            <h3>GLOBAL DATA</h3>
            <p>Territory standings.</p>
            <Link to="/stats" className="p-link">DASHBOARD →</Link>
          </div>
        </div>
      </section>

      {/* Elite System Footer */}
      <footer className="elite-footer">
        <div className="footer-bracket"></div>
        <div className="footer-info">
          <div className="f-left">
            <span>© 2026 CRICSTATS // ALL RIGHTS RESERVED</span>
          </div>
          <div className="f-right">
            <span>SECURE LINK: 128.0.0.1 // ENCRYPTION: AES-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;