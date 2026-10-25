import { C } from "../../theme.js";

const CanvasToolbar = ({ runWorkflow, isRunning }) => (
  <div
    style={{
      position: "absolute",
      top: 16,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 8,
      zIndex: 10,
      background: "rgba(31,28,25,.9)",
      backdropFilter: "blur(16px)",
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: "8px 12px",
    }}
  >
    {[
      { icon: "↩", tip: "Undo" },
      { icon: "↪", tip: "Redo" },
      { icon: "⊕", tip: "Add Node" },
      { icon: "⊞", tip: "Group" },
      { icon: "🗺", tip: "Minimap" },
      { icon: "⚖", tip: "Align" },
    ].map((a) => (
      <button
        key={a.tip}
        title={a.tip}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          background: "transparent",
          color: C.muted,
          cursor: "pointer",
          fontSize: 15,
          transition: "all .15s",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = C.ivory;
          e.target.style.background = C.glass;
        }}
        onMouseLeave={(e) => {
          e.target.style.color = C.muted;
          e.target.style.background = "transparent";
        }}
      >
        {a.icon}
      </button>
    ))}
    <div style={{ width: 1, background: C.border, margin: "0 4px" }} />
    <button className="btn-emerald" style={{ padding: "0 16px", height: 34, fontSize: 13 }} onClick={runWorkflow} disabled={isRunning}>
      {isRunning ? "● Running" : "▶ Run"}
    </button>
  </div>
);

export default CanvasToolbar;
