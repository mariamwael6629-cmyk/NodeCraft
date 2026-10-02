import { C } from "../../theme.js";
import { nodeLibrary } from "../../data/workflowBuilder.js";

const NodeLibrary = ({ expandedCategory, setExpandedCategory, onAddNode }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
    {nodeLibrary.map((cat) => (
      <div key={cat.category} style={{ marginBottom: 4 }}>
        <div
          onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            color: C.muted,
            display: "flex",
            justifyContent: "space-between",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: expandedCategory === cat.category ? "rgba(255,255,255,.04)" : "none",
          }}
        >
          {cat.category}
          <span>{expandedCategory === cat.category ? "▾" : "▸"}</span>
        </div>
        {expandedCategory === cat.category &&
          cat.nodes.map((n) => (
            <div
              key={n.type}
              className="sidebar-item"
              style={{ paddingLeft: 24 }}
              onClick={() => onAddNode(n)}
            >
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span style={{ fontSize: 12 }}>{n.label}</span>
              <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: n.color, opacity: 0.7 }} />
            </div>
          ))}
      </div>
    ))}
  </div>
);

export default NodeLibrary;
