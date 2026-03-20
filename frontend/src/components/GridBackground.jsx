import React from "react";

export const GridBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[#020205] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Radial Gradient Overlay for that Shadcn Look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05)_0,transparent_100%)]"></div>
      
      {/* Secondary Atmosphere Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,0,110,0.03)_0,transparent_40%)]"></div>
    </div>
  );
};
