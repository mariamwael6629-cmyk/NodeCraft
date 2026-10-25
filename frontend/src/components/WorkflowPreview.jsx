import { useState, useEffect } from "react";
import { C } from "../theme.js";

const WorkflowPreview = () => {
  const nodes = [
    { id: 1, x: 40, y: 80, label: "Trigger", sub: "Webhook", color: C.emerald, icon: "⚡" },
    { id: 2, x: 220, y: 30, label: "AI Agent", sub: "GPT-4", color: C.purple, icon: "🤖" },
    { id: 3, x: 220, y: 140, label: "Filter", sub: "Condition", color: "#F59E0B", icon: "⚖️" },
    { id: 4, x: 400, y: 80, label: "Database", sub: "Write Row", color: "#CF7B4A", icon: "🗄" },
    { id: 5, x: 580, y: 40, label: "Email", sub: "Send", color: C.emerald, icon: "✉️" },
    { id: 6, x: 580, y: 130, label: "Slack", sub: "Notify", color: C.purple, icon: "💬" },
  ];
  const edges = [
    { x1: 140, y1: 100, x2: 220, y2: 54 },
    { x1: 140, y1: 100, x2: 220, y2: 164 },
    { x1: 320, y1: 54, x2: 400, y2: 100 },
    { x1: 320, y1: 164, x2: 400, y2: 100 },
    { x1: 500, y1: 100, x2: 580, y2: 64 },
    { x1: 500, y1: 100, x2: 580, y2: 154 },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % nodes.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", height: 220, overflow: "hidden" }}>
      <svg width="100%" height="220" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="c" />
            <feMerge>
              <feMergeNode in="c" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((e, i) => (
          <g key={i}>
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="rgba(159,85,42,.15)" strokeWidth="2" />
            <line
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={C.emerald}
              strokeWidth="1.5"
              strokeDasharray="5 5"
              style={{ animation: `dash 1.5s linear infinite`, strokeDashoffset: 0 }}
            />
          </g>
        ))}
        {nodes.map((n, i) => (
          <g key={n.id} style={{ animation: `node-appear .4s ${i * 0.08}s both` }}>
            <rect
              x={n.x}
              y={n.y - 20}
              width={100}
              height={60}
              rx="12"
              fill={`${n.color}18`}
              stroke={active === i ? n.color : "rgba(255,255,255,.1)"}
              strokeWidth={active === i ? 2 : 1}
              filter={active === i ? "url(#glow)" : "none"}
              style={{ transition: "all .3s" }}
            />
            <text x={n.x + 14} y={n.y + 4} fontSize="18" dominantBaseline="middle">
              {n.icon}
            </text>
            <text x={n.x + 12} y={n.y + 18} fontSize="11" fontWeight="700" fill={n.color}>
              {n.label}
            </text>
            <text x={n.x + 12} y={n.y + 30} fontSize="10" fill="rgba(255,255,255,.4)">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WorkflowPreview;
