import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const nodeLibrary = [
  {
    category: "AI Agents",
    nodes: [
      { type: "ai-agent", label: "AI Agent", icon: "🤖", color: C.purple },
      { type: "llm", label: "LLM Model", icon: "🧠", color: C.purple },
      { type: "rag", label: "RAG Chain", icon: "📚", color: C.purple },
    ],
  },
  {
    category: "Data",
    nodes: [
      { type: "db-read", label: "DB Read", icon: "🗄", color: "#3B82F6" },
      { type: "db-write", label: "DB Write", icon: "💾", color: "#3B82F6" },
      { type: "transform", label: "Transform", icon: "🔄", color: "#3B82F6" },
    ],
  },
  {
    category: "Actions",
    nodes: [
      { type: "email", label: "Email", icon: "✉️", color: C.emerald },
      { type: "slack", label: "Slack", icon: "💬", color: C.emerald },
      { type: "webhook", label: "Webhook", icon: "🌐", color: C.emerald },
      { type: "http", label: "HTTP Request", icon: "🔗", color: C.emerald },
    ],
  },
  {
    category: "Logic",
    nodes: [
      { type: "condition", label: "Condition", icon: "⚖️", color: "#F59E0B" },
      { type: "loop", label: "Loop", icon: "🔁", color: "#F59E0B" },
      { type: "schedule", label: "Schedule", icon: "⏰", color: "#F59E0B" },
      { type: "delay", label: "Delay", icon: "⏸", color: "#F59E0B" },
    ],
  },
];

const DEFAULT_NODES = [
  { id: 1, x: 120, y: 100, type: "trigger", label: "Webhook Trigger", icon: "⚡", color: C.emerald, sub: "POST /lead" },
  { id: 2, x: 340, y: 60, type: "llm", label: "Qualify Lead", icon: "🧠", color: C.purple, sub: "GPT-4o" },
  { id: 3, x: 340, y: 180, type: "condition", label: "Score ≥ 80?", icon: "⚖️", color: "#F59E0B", sub: "Filter" },
  { id: 4, x: 560, y: 100, type: "email", label: "Send Outreach", icon: "✉️", color: C.emerald, sub: "Personalized" },
  { id: 5, x: 560, y: 220, type: "db-write", label: "Log to CRM", icon: "🗄", color: "#3B82F6", sub: "Salesforce" },
];
const DEFAULT_EDGES = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
];

const WorkflowBuilder = () => {
  const { user } = useAuth();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI workflow assistant. Describe what you want to automate and I'll build it for you." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("components");
  const canvasRef = useRef(null);
  const [expandedCategory, setExpandedCategory] = useState("AI Agents");
  const [isRunning, setIsRunning] = useState(false);
  const [runningNode, setRunningNode] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await api.workflows.list();
        let wf = list[0];
        if (!wf) {
          wf = await api.workflows.create({
            name: "Lead Generation Pipeline",
            description: "AI-qualified lead routing and outreach",
            nodes: DEFAULT_NODES,
            edges: DEFAULT_EDGES,
          });
        }
        if (cancelled) return;
        setWorkflow(wf);
        setNodes(wf.nodes && wf.nodes.length ? wf.nodes : DEFAULT_NODES);
        setEdges(wf.edges && wf.edges.length ? wf.edges : DEFAULT_EDGES);
        setSelected((wf.nodes && wf.nodes[0]?.id) ?? null);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load workflow");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const persistNodes = useCallback(
    async (nextNodes, nextEdges) => {
      if (!workflow) return;
      try {
        const updated = await api.workflows.update(workflow.id, { nodes: nextNodes, edges: nextEdges ?? edges });
        setWorkflow(updated);
      } catch {
        // best-effort persistence; canvas state remains usable locally
      }
    },
    [workflow, edges]
  );

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragging(id);
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelected(id);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging || !canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragging ? { ...n, x: e.clientX - canvasRect.left - dragOffset.x, y: e.clientY - canvasRect.top - dragOffset.y } : n
        )
      );
    },
    [dragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setDragging((prev) => {
      if (prev !== null) {
        setNodes((current) => {
          persistNodes(current);
          return current;
        });
      }
      return null;
    });
  }, [persistNodes]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const runWorkflow = async () => {
    if (!workflow || isRunning) return;
    setIsRunning(true);
    try {
      const result = await api.workflows.run(workflow.id);
      const order = nodes.map((n) => n.id);
      let i = 0;
      const interval = setInterval(() => {
        setRunningNode(order[i]);
        i++;
        if (i >= order.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunning(false);
            setRunningNode(null);
          }, 600);
        }
      }, 600);
      setWorkflow(result.workflow);
    } catch (err) {
      setIsRunning(false);
      setError(err.message || "Run failed");
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatBusy) return;
    const message = chatInput;
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", text: message }]);
    setChatBusy(true);
    try {
      const res = await api.assistant.chat(message);
      setChatMessages((m) => [...m, { role: "ai", text: res.reply }]);
      if (res.nodes && res.nodes.length) {
        const maxId = nodes.reduce((max, n) => Math.max(max, n.id), 0);
        const maxX = nodes.reduce((max, n) => Math.max(max, n.x), 0);
        const idMap = {};
        const newNodes = res.nodes.map((n, i) => {
          const id = maxId + i + 1;
          idMap[n.id] = id;
          return { ...n, id, x: maxX + 220 + n.x - (res.nodes[0]?.x ?? 0), y: 320 };
        });
        const newEdges = (res.edges || []).map((e) => ({ from: idMap[e.from], to: idMap[e.to] }));
        const nextNodes = [...nodes, ...newNodes];
        const nextEdges = [...edges, ...newEdges];
        setNodes(nextNodes);
        setEdges(nextEdges);
        persistNodes(nextNodes, nextEdges);
      }
    } catch (err) {
      setChatMessages((m) => [...m, { role: "ai", text: `Sorry, something went wrong: ${err.message || "request failed"}` }]);
    } finally {
      setChatBusy(false);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selected);

  const getEdgePoints = (edge) => {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) return null;
    return { x1: from.x + 160, y1: from.y + 40, x2: to.x, y2: to.y + 40 };
  };

  if (!user) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Sign in to start building workflows.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Loading workflow…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", paddingTop: 60, position: "relative", zIndex: 1 }}>
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
                      onClick={() => {
                        const maxId = nodes.reduce((max, x) => Math.max(max, x.id), 0);
                        const newNode = { id: maxId + 1, x: 200 + maxId * 20, y: 300, ...n, sub: n.label };
                        const nextNodes = [...nodes, newNode];
                        setNodes(nextNodes);
                        setSelected(newNode.id);
                        persistNodes(nextNodes);
                      }}
                    >
                      <span style={{ fontSize: 15 }}>{n.icon}</span>
                      <span style={{ fontSize: 12 }}>{n.label}</span>
                      <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: n.color, opacity: 0.7 }} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>

      <div
        ref={canvasRef}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(ellipse at 40% 30%, rgba(16,185,129,.04) 0%, transparent 60%),
                    radial-gradient(ellipse at 70% 70%, rgba(139,92,246,.04) 0%, transparent 60%),
                    ${C.charcoal}`,
          backgroundImage: `
          linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
        `,
          backgroundSize: "30px 30px",
        }}
        onClick={() => setSelected(null)}
      >
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 10,
            background: "rgba(17,24,39,.9)",
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

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <defs>
            <marker id="arrowE" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M2 2L8 5L2 8" fill="none" stroke="rgba(16,185,129,.6)" strokeWidth="1.5" strokeLinecap="round" />
            </marker>
          </defs>
          {edges.map((edge, i) => {
            const pts = getEdgePoints(edge);
            if (!pts) return null;
            const mx = (pts.x1 + pts.x2) / 2;
            return (
              <g key={i}>
                <path d={`M${pts.x1},${pts.y1} C${mx},${pts.y1} ${mx},${pts.y2} ${pts.x2},${pts.y2}`} fill="none" stroke="rgba(16,185,129,.2)" strokeWidth="2" />
                <path
                  d={`M${pts.x1},${pts.y1} C${mx},${pts.y1} ${mx},${pts.y2} ${pts.x2},${pts.y2}`}
                  fill="none"
                  stroke={C.emerald}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  style={{ animation: `dash 2s linear infinite` }}
                  markerEnd="url(#arrowE)"
                />
              </g>
            );
          })}
        </svg>

        {nodes.map((n) => (
          <div
            key={n.id}
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
        ))}

        <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 4 }}>
          {["+", "—", "⊡"].map((b) => (
            <button
              key={b}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "rgba(17,24,39,.9)",
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
      </div>

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
              <button className="btn-emerald" style={{ flex: 1, padding: "10px", fontSize: 13 }} onClick={() => persistNodes(nodes)}>
                Save
              </button>
              <button
                className="btn-ghost"
                style={{ flex: 1, padding: "10px", fontSize: 13 }}
                onClick={() => {
                  setRunningNode(selectedNode.id);
                  setTimeout(() => setRunningNode(null), 800);
                }}
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
      {error && (
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#EF4444", padding: "8px 16px", borderRadius: 10, fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
