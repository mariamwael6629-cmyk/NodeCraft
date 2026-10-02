import { C } from "../../theme.js";

const CanvasNode = ({ node: n, selected, runningNode, handleMouseDown, setSelected }) => (
  <div
    className={`workflow-node${selected === n.id ? " selected" : ""}`}
    style={{
      left: n.x,
      top: n.y,
      width: 160,
      background: runningNode === n.id ? `linear-gradient(135deg,${n.color}30,${n.color}15)` : `linear-gradient(135deg,${n.color}15,rgba(0,0,0,.2))`,
      borderColor: runningNode === n.id ? n.color : selected === n.id ? "rgba(16,185,129,.6)" : C.borderMed,
      boxShadow: runningNode === n.id ? `0 0 20px ${n.color}50,0 0 40px ${n.color}20` : selected === n.id ? "0 0 20px rgba(16,185,129,.2)" : "none",
    }}
    onMouseDown={(e) => handleMouseDown(e, n.id)}
    onClick={(e) => {
      e.stopPropagation();
      setSelected(n.id);
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 20 }}>{n.icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ivory }}>{n.label}</div>
        <div style={{ fontSize: 10, color: C.muted }}>{n.sub}</div>
      </div>
    </div>
    {runningNode === n.id && (
      <div style={{ height: 2, background: n.color, borderRadius: 1, marginTop: 4, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "40%",
            background: "rgba(255,255,255,.6)",
            borderRadius: 1,
            animation: "shimmer 1s linear infinite",
          }}
        />
      </div>
    )}
  </div>
);

export default CanvasNode;
