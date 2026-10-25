"""Lightweight rule-based stand-in for an LLM workflow generator.

Looks at keywords in the user's message and returns a starter set of nodes/edges
plus a friendly reply, so the builder canvas can be populated without requiring
a real LLM API key.
"""

KEYWORD_NODES = {
    "email": {"type": "email", "label": "Send Email", "icon": "✉️", "color": "#10B981", "sub": "Outreach"},
    "slack": {"type": "slack", "label": "Slack Notify", "icon": "💬", "color": "#8B5CF6", "sub": "Notification"},
    "lead": {"type": "llm", "label": "Qualify Lead", "icon": "🧠", "color": "#8B5CF6", "sub": "GPT-4o"},
    "crm": {"type": "db-write", "label": "Log to CRM", "icon": "🗄", "color": "#3B82F6", "sub": "Write Row"},
    "schedule": {"type": "schedule", "label": "Schedule", "icon": "⏰", "color": "#D36A2D", "sub": "Trigger"},
    "support": {"type": "ai-agent", "label": "Triage Ticket", "icon": "🤖", "color": "#8B5CF6", "sub": "AI Agent"},
    "webhook": {"type": "webhook", "label": "Webhook Trigger", "icon": "⚡", "color": "#10B981", "sub": "Incoming"},
}


def generate_workflow(message: str) -> tuple[str, list[dict], list[dict]]:
    text = message.lower()
    matched = [node for kw, node in KEYWORD_NODES.items() if kw in text]

    if not matched:
        matched = [
            {"type": "webhook", "label": "Webhook Trigger", "icon": "⚡", "color": "#10B981", "sub": "Incoming"},
            {"type": "ai-agent", "label": "AI Agent", "icon": "🤖", "color": "#8B5CF6", "sub": "Process"},
        ]

    nodes = []
    edges = []
    x = 120
    for i, node in enumerate(matched):
        nodes.append({"id": i + 1, "x": x, "y": 100, **node})
        if i > 0:
            edges.append({"from": i, "to": i + 1})
        x += 220

    reply = (
        f"I've sketched a {len(nodes)}-node workflow based on your request. "
        "Check the canvas — you can drag nodes around and connect them further."
    )
    return reply, nodes, edges
