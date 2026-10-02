import { C } from "../theme.js";

// Node palette and the starter workflow used when a user has none yet.
export const nodeLibrary = [
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

export const DEFAULT_NODES = [
  { id: 1, x: 120, y: 100, type: "trigger", label: "Webhook Trigger", icon: "⚡", color: C.emerald, sub: "POST /lead" },
  { id: 2, x: 340, y: 60, type: "llm", label: "Qualify Lead", icon: "🧠", color: C.purple, sub: "GPT-4o" },
  { id: 3, x: 340, y: 180, type: "condition", label: "Score ≥ 80?", icon: "⚖️", color: "#F59E0B", sub: "Filter" },
  { id: 4, x: 560, y: 100, type: "email", label: "Send Outreach", icon: "✉️", color: C.emerald, sub: "Personalized" },
  { id: 5, x: 560, y: 220, type: "db-write", label: "Log to CRM", icon: "🗄", color: "#3B82F6", sub: "Salesforce" },
];
export const DEFAULT_EDGES = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
];
