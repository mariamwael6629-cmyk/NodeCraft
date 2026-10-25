import { C } from "../../theme.js";

const ZoomControls = () => (
  <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 4 }}>
    {["+", "—", "⊡"].map((b) => (
      <button
        key={b}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          background: "rgba(31,28,25,.9)",
          color: C.muted,
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {b}
      </button>
    ))}
  </div>
);

export default ZoomControls;
