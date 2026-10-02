import { C } from "../../theme.js";

const AssistantPanel = ({ chatMessages, chatBusy, chatInput, setChatInput, sendChat }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {chatMessages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div className={`chat-bubble ${m.role}`}>{m.text}</div>
          </div>
        ))}
        {chatBusy && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div className="chat-bubble ai">Thinking…</div>
          </div>
        )}
      </div>
      <div style={{ padding: 10, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
          placeholder="Describe a workflow…"
          style={{ flex: 1, fontSize: 12, padding: "8px 10px" }}
        />
        <button className="btn-purple" style={{ padding: "8px 12px", fontSize: 12 }} onClick={sendChat} disabled={chatBusy}>
          ↑
        </button>
      </div>
    </div>
);

export default AssistantPanel;
