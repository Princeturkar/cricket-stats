import React from 'react';
import { motion } from 'framer-motion';
import '../styles/RoboticsUI.css';

export const RoboticsUI = () => {
  return (
    <div className="robotics-container">
      <div className="r-hud-wrapper">
        
        {/* Core Energy Center */}
        <div className="r-core-glow"></div>
        <div className="r-core-center">
          <div className="r-core-inner">
            <span className="r-core-text">AI</span>
          </div>
        </div>

        {/* Orbiting Tech Rings */}
        <div className="r-ring r-ring-1"></div>
        <div className="r-ring r-ring-2"></div>
        <div className="r-ring r-ring-3"></div>

        {/* Scanning Elements */}
        <div className="r-scanner-line"></div>
        
        {/* Data Nodes */}
        <div className="r-node top-node">
          <span className="node-dot"></span>
          <span className="node-line"></span>
          <span className="node-text">SYS_SYNC</span>
        </div>
        <div className="r-node bottom-node">
          <span className="node-dot"></span>
          <span className="node-line"></span>
          <span className="node-text">NEURAL_NET</span>
        </div>
      </div>
    </div>
  );
};
