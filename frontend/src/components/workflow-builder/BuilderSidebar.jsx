import { useState } from "react";
import { C } from "../../theme.js";
import NodeLibrary from "./NodeLibrary.jsx";
import AssistantPanel from "./AssistantPanel.jsx";

const BuilderSidebar = ({ onAddNode, chat }) => {
  const [activeTab, setActiveTab] = useState("components");
  // Kept here (not in NodeLibrary) so the open category survives tab switches.
  const [expandedCategory, setExpandedCategory] = useState("AI Agents");

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        background: "rgba(17,24,39,.95)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
        {["components", "assistant"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              flex: 1,
              padding: "12px 8px",
              fontSize: 12,
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === t ? C.emeraldGlow : C.muted,
              borderBottom: activeTab === t ? `2px solid ${C.emerald}` : "2px solid transparent",
              textTransform: "capitalize",
              letterSpacing: ".3px",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "components" ? (
        <NodeLibrary expandedCategory={expandedCategory} setExpandedCategory={setExpandedCategory} onAddNode={onAddNode} />
      ) : (
        <AssistantPanel {...chat} />
      )}
    </div>
  );
};

export default BuilderSidebar;
