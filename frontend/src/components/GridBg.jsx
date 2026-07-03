const GridBg = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      backgroundImage: `
      linear-gradient(rgba(16,185,129,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,.04) 1px, transparent 1px)
    `,
      backgroundSize: "60px 60px",
      animation: "grid-scroll 8s linear infinite",
    }}
  />
);

export default GridBg;
