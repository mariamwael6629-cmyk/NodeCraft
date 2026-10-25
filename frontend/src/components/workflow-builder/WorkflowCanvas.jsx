import { C } from "../../theme.js";
import CanvasToolbar from "./CanvasToolbar.jsx";
import EdgeLayer from "./EdgeLayer.jsx";
import CanvasNode from "./CanvasNode.jsx";
import ZoomControls from "./ZoomControls.jsx";

const WorkflowCanvas = ({ canvasRef, nodes, edges, selected, setSelected, runningNode, isRunning, runWorkflow, handleMouseDown }) => (
  <div
    ref={canvasRef}
    style={{
      flex: 1,
      position: "relative",
      overflow: "hidden",
      background: `radial-gradient(ellipse at 40% 30%, rgba(159,85,42,.04) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(207,123,74,.04) 0%, transparent 60%),
                ${C.charcoal}`,
      backgroundImage: `
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
    `,
      backgroundSize: "30px 30px",
    }}
    onClick={() => setSelected(null)}
  >
    <CanvasToolbar runWorkflow={runWorkflow} isRunning={isRunning} />

    <EdgeLayer nodes={nodes} edges={edges} />

    {nodes.map((n) => (
      <CanvasNode
        key={n.id}
        node={n}
        selected={selected}
        runningNode={runningNode}
        handleMouseDown={handleMouseDown}
        setSelected={setSelected}
      />
    ))}

    <ZoomControls />
  </div>
);

export default WorkflowCanvas;
