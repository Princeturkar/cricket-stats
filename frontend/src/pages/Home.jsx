import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Home.css";
import { GridBackground } from "../components/GridBackground";
import { Spotlight } from "../components/Spotlight";
import { BackgroundBeams } from "../components/BackgroundBeams";
import { RoboticsUI } from "../components/RoboticsUI";

function Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const tiltX = (clientY - centerY) / 60;
      const tiltY = (clientX - centerX) / 60;

      if (titleRef.current) {
        titleRef.current.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg) translateZ(50px)`;
      }

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mx', `${clientX}px`);
        containerRef.current.style.setProperty('--my', `${clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  const bentoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <div className="elite-protocol-container" ref={containerRef}>
      <BackgroundBeams />
      <GridBackground />
      <Spotlight />
      <div className="scanline-overlay"></div>
      
      {/* HUD Frame */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="ui-hud-frame"
      >
        <div className="hud-corner tl"></div>
        <div className="hud-corner tr"></div>
        <div className="hud-corner bl"></div>
        <div className="hud-corner br"></div>
        <div className="hud-coords">SYS_LAT: 34.0522 // SYS_LONG: -118.2437</div>
      </motion.div>
      
      <section className="control-hero">
        {/* Parallax Background Removed in favor of Shadcn integration */}
        
        <div className="hero-atmosphere"></div>
        
        <motion.div 
          className="command-center-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="protocol-tag" variants={itemVariants}>
            <span className="dot pulse"></span>
            ELITE COMMAND PROTOCOL
          </motion.div>
          
          <motion.h1 
            className="protocol-title" 
            ref={titleRef}
            variants={itemVariants}
          >
            <span className="p-main">CRIC<span className="cyan-text">STATS</span> NODE</span>
            <span className="p-top" style={{ marginTop: '20px' }}>SYSTEM ACCESS GRANTED</span>
          </motion.h1>

          <motion.p className="protocol-desc" variants={itemVariants}>
            Next-generation scouting interface. Real-time sensory data synchronized 
            with global cricket neural networks.
          </motion.p>

          <motion.div className="protocol-cta" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/rankings" className="btn-protocol-primary">
                <span className="btn-brackets"></span>
                <span className="btn-content">INITIALIZE DATABASE</span>
                <span className="b-scan"></span>
                <span className="btn-glitch-layer"></span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/compare" className="btn-protocol-secondary">
                <span className="btn-brackets"></span>
                <span className="btn-content">OPEN BATTLE MODULE</span>
                <span className="btn-glitch-layer"></span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Sensory Ticker */}
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
      <section className="protocol-bento-section">
        <motion.div 
          className="protocol-section-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.span className="p-sub" variants={itemVariants}>SELECT MODULE</motion.span>
          <motion.h2 variants={itemVariants}>KINETIC INTERFACE</motion.h2>
        </motion.div>

        <motion.div 
          className="protocol-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.div className="p-card card-large glass-cyber" variants={bentoVariants}>
            <img src="/roko.jpg" alt="Elite Legends" className="p-card-img" />
            <div className="p-card-overlay">
              <span className="p-badge">LEGACY NODE</span>
              <h3>THE ROKO PROTOCOL</h3>
              <p>Advanced biomechanical analysis of contemporary greats.</p>
              <Link to="/players" className="p-card-btn">VIEW ROSTER</Link>
            </div>
            <div className="card-reflection"></div>
          </motion.div>

          <motion.div 
            className="p-card card-small glass-cyber ai-node" 
            variants={bentoVariants}
            whileHover={{ y: -10, borderColor: "#00f2ff" }}
          >
            <div className="node-rings" style={{ transform: 'scale(0.5)', opacity: 0.8, marginBottom: '-80px', marginTop: '-40px' }}>
              <RoboticsUI />
            </div>
            <h3 style={{ zIndex: 10 }}>AI PREDICTOR</h3>
            <p style={{ zIndex: 10 }}>Neural match casting.</p>
            <Link to="/chat" className="p-link" style={{ zIndex: 10 }}>SYNC →</Link>
          </motion.div>

          <motion.div 
            className="p-card card-small glass-cyber arena-node" 
            variants={bentoVariants}
            whileHover={{ y: -10, borderColor: "#ff006e" }}
          >
            <div className="arena-bg-text">FX</div>
            <div className="node-icon">⚔️</div>
            <h3>BATTLE FX</h3>
            <p>Kinetic 1v1 Arena.</p>
            <Link to="/compare" className="p-link">ENTER →</Link>
          </motion.div>

          <motion.div 
            className="p-card card-small glass-cyber data-node" 
            variants={bentoVariants}
            whileHover={{ y: -10, borderColor: "#ffffff" }}
          >
            <div className="node-icon">📊</div>
            <h3>GLOBAL DATA</h3>
            <p>Territory standings.</p>
            <Link to="/stats" className="p-link">DASHBOARD →</Link>
          </motion.div>
        </motion.div>
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