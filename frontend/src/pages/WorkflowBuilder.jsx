import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { DEFAULT_NODES, DEFAULT_EDGES } from "../data/workflowBuilder.js";
import useNodeDrag from "../hooks/useNodeDrag.js";
import BuilderSidebar from "../components/workflow-builder/BuilderSidebar.jsx";
import WorkflowCanvas from "../components/workflow-builder/WorkflowCanvas.jsx";
import NodeInspector from "../components/workflow-builder/NodeInspector.jsx";

const WorkflowBuilder = () => {
  const { user } = useAuth();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI workflow assistant. Describe what you want to automate and I'll build it for you." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const canvasRef = useRef(null);
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

  const handleMouseDown = useNodeDrag({ canvasRef, setNodes, setSelected, persistNodes });

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

  const addNodeFromLibrary = (n) => {
    const maxId = nodes.reduce((max, x) => Math.max(max, x.id), 0);
    const newNode = { id: maxId + 1, x: 200 + maxId * 20, y: 300, ...n, sub: n.label };
    const nextNodes = [...nodes, newNode];
    setNodes(nextNodes);
    setSelected(newNode.id);
    persistNodes(nextNodes);
  };

  const selectedNode = nodes.find((n) => n.id === selected);

  const testSelectedNode = () => {
    setRunningNode(selectedNode.id);
    setTimeout(() => setRunningNode(null), 800);
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
      <BuilderSidebar
        onAddNode={addNodeFromLibrary}
        chat={{ chatMessages, chatBusy, chatInput, setChatInput, sendChat }}
      />

      <WorkflowCanvas
        canvasRef={canvasRef}
        nodes={nodes}
        edges={edges}
        selected={selected}
        setSelected={setSelected}
        runningNode={runningNode}
        isRunning={isRunning}
        runWorkflow={runWorkflow}
        handleMouseDown={handleMouseDown}
      />

      <NodeInspector selectedNode={selectedNode} onSave={() => persistNodes(nodes)} onTest={testSelectedNode} />
      {error && (
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#EF4444", padding: "8px 16px", borderRadius: 10, fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
