import { useState, useEffect, useCallback } from "react";

// Drag-to-move for canvas nodes; persists positions when the drag ends.
export default function useNodeDrag({ canvasRef, setNodes, setSelected, persistNodes }) {
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  return handleMouseDown;
}
