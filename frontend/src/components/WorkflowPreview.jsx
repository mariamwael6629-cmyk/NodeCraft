import { useState, useEffect } from "react";
import { C } from "../theme.js";
import Glyph from "./Glyph.jsx";

// Home page preview drawn as a model railway layout: each node is a station
// board, each connection is a length of track, and a small train runs the
// top route. The signal lamp on the station being served turns green.
const WorkflowPreview = () => {
  const nodes = [
    { id: 1, x: 40, y: 80, label: "Trigger", sub: "Webhook", color: C.emerald, icon: "⚡" },
    { id: 2, x: 220, y: 30, label: "AI Agent", sub: "GPT-4", color: C.purple, icon: "🤖" },
    { id: 3, x: 220, y: 140, label: "Filter", sub: "Condition", color: "#E8A33A", icon: "⚖️" },
    { id: 4, x: 400, y: 80, label: "Database", sub: "Write Row", color: "#6FA3C7", icon: "🗄" },
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
  const route = "M140 100 L220 54 L320 54 L400 100 L500 100 L580 64";
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % nodes.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", height: 220, overflow: "hidden" }}>
      <svg width="100%" height="220" viewBox="0 0 700 220" style={{ position: "absolute", inset: 0 }}>
        {edges.map((e, i) => (
          <g key={i}>
            {/* sleepers */}
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#5A4A36" strokeWidth="12" strokeDasharray="2 6" />
            {/* rails */}
            <line x1={e.x1} y1={e.y1 - 3} x2={e.x2} y2={e.y2 - 3} stroke="#9C9A8E" strokeWidth="1.4" />
            <line x1={e.x1} y1={e.y1 + 3} x2={e.x2} y2={e.y2 + 3} stroke="#9C9A8E" strokeWidth="1.4" />
          </g>
        ))}
        <g className="nc-train">
          <rect x="-11" y="-5" width="22" height="10" rx="2" fill="#B5432F" stroke="#161A16" strokeWidth="1" />
          <rect x="3" y="-3" width="5" height="4" fill="#EDE6D3" />
          <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path={route} />
        </g>
        {nodes.map((n, i) => (
          <g key={n.id} style={{ animation: `node-appear .4s ${i * 0.08}s both` }}>
            <rect x={n.x} y={n.y - 20} width={100} height={60} rx="3" fill="#EDE6D3" stroke="#161A16" strokeWidth="1.5" />
            <rect x={n.x} y={n.y - 20} width={100} height={6} fill={n.color} />
            <circle cx={n.x + 88} cy={n.y - 4} r="4" fill={active === i ? "#6CC07A" : "#4A4F48"} stroke="#161A16" strokeWidth="1" />
            <foreignObject x={n.x + 10} y={n.y - 10} width="18" height="18">
              <div style={{ color: "#161A16", display: "flex" }}>
                <Glyph e={n.icon} size={16} />
              </div>
            </foreignObject>
            <text x={n.x + 10} y={n.y + 20} fontSize="12" fontWeight="700" fill="#161A16" fontFamily="Cabin, sans-serif">
              {n.label}
            </text>
            <text x={n.x + 10} y={n.y + 33} fontSize="10.5" fill="#5C5A50" fontFamily="Cabin, sans-serif">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WorkflowPreview;
