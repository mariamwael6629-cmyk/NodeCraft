import { C } from "../../theme.js";

const EdgeLayer = ({ nodes, edges }) => {
  const getEdgePoints = (edge) => {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) return null;
    return { x1: from.x + 160, y1: from.y + 40, x2: to.x, y2: to.y + 40 };
  };

  return (
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
  );
};

export default EdgeLayer;
