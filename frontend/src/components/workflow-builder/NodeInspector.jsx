import { C } from "../../theme.js";

const NodeInspector = ({ selectedNode, onSave, onTest }) => (
  <div
    style={{
      width: 280,
      flexShrink: 0,
      borderLeft: `1px solid ${C.border}`,
      background: "rgba(17,24,39,.95)",
      overflow: "auto",
    }}
  >
    {selectedNode ? (
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 24 }}>{selectedNode.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedNode.label}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Node Configuration</div>
          </div>
        </div>

        {[
          { label: "Node Name", val: selectedNode.label, type: "text" },
          { label: "Description", val: selectedNode.sub || "Process incoming data", type: "text" },
          { label: "Timeout (ms)", val: "30000", type: "text" },
          { label: "Retry on Fail", val: "3 attempts", type: "text" },
        ].map((f) => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600, letterSpacing: ".3px", textTransform: "uppercase" }}>
              {f.label}
            </label>
            <input defaultValue={f.val} style={{ width: "100%" }} />
          </div>
        ))}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: C.muted, letterSpacing: ".5px", textTransform: "uppercase" }}>Output Schema</div>
          {["lead_id", "score", "email", "company"].map((f) => (
            <div
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 8,
                background: "rgba(255,255,255,.03)",
                marginBottom: 4,
                fontSize: 12,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.emerald }} />
              <span style={{ color: C.ivory }}>{f}</span>
              <span style={{ marginLeft: "auto", color: C.muted, fontSize: 11 }}>string</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
          <button className="btn-emerald" style={{ flex: 1, padding: "10px", fontSize: 13 }} onClick={onSave}>
            Save
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, padding: "10px", fontSize: 13 }}
            onClick={onTest}
          >
            Test
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: C.muted, letterSpacing: ".5px", textTransform: "uppercase" }}>Version History</div>
          {["v3 — 2h ago", "v2 — 1d ago", "v1 — 3d ago"].map((v) => (
            <div
              key={v}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                fontSize: 11,
                color: C.muted,
                cursor: "pointer",
                marginBottom: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {v}
              <span style={{ color: C.emeraldGlow }}>Restore</span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.muted, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
        <div style={{ fontSize: 13 }}>Click any node to configure it</div>
      </div>
    )}
  </div>
);

export default NodeInspector;
