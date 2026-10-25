from sqlalchemy.orm import Session

from app.models.integration import Integration
from app.models.pricing import PricingPlan
from app.models.template import Template

TEMPLATES = [
    {
        "name": "Lead Qualification Engine", "category": "Sales", "icon": "🎯", "color": "#8B5CF6",
        "description": "AI scores inbound leads and routes to the right rep automatically.",
        "node_count": 8, "uses": 4200,
        "nodes": [
            {"id": 1, "x": 80, "y": 100, "type": "webhook", "label": "Lead Webhook", "icon": "⚡", "color": "#10B981", "sub": "POST /lead"},
            {"id": 2, "x": 300, "y": 100, "type": "llm", "label": "Score Lead", "icon": "🧠", "color": "#8B5CF6", "sub": "GPT-4o"},
            {"id": 3, "x": 520, "y": 100, "type": "db-write", "label": "Route to Rep", "icon": "🗄", "color": "#3B82F6", "sub": "CRM"},
        ],
        "edges": [{"from": 1, "to": 2}, {"from": 2, "to": 3}],
    },
    {
        "name": "Content Pipeline", "category": "Marketing", "icon": "✍️", "color": "#10B981",
        "description": "Generate, review, schedule and publish content across all channels.",
        "node_count": 12, "uses": 3800, "nodes": [], "edges": [],
    },
    {
        "name": "Email Nurture Sequence", "category": "Marketing", "icon": "📧", "color": "#3B82F6",
        "description": "Personalized email sequences triggered by user behavior signals.",
        "node_count": 6, "uses": 6100, "nodes": [], "edges": [],
    },
    {
        "name": "CRM Sync & Enrich", "category": "Sales", "icon": "🔗", "color": "#10B981",
        "description": "Keep your CRM updated and enrich contacts with external data.",
        "node_count": 9, "uses": 2900, "nodes": [], "edges": [],
    },
    {
        "name": "Support Ticket Triage", "category": "Support", "icon": "🎫", "color": "#8B5CF6",
        "description": "AI categorizes and prioritizes tickets, assigns to agents.",
        "node_count": 11, "uses": 5400, "nodes": [], "edges": [],
    },
    {
        "name": "Social Auto-Post", "category": "Marketing", "icon": "📱", "color": "#D36A2D",
        "description": "Generate and schedule posts optimized for each social platform.",
        "node_count": 7, "uses": 3300, "nodes": [], "edges": [],
    },
    {
        "name": "Data Quality Monitor", "category": "Data", "icon": "📊", "color": "#3B82F6",
        "description": "Detect anomalies, validate schemas, and alert on data issues.",
        "node_count": 15, "uses": 1800, "nodes": [], "edges": [],
    },
    {
        "name": "Customer Onboarding", "category": "Support", "icon": "🚀", "color": "#10B981",
        "description": "Automate the entire onboarding journey from signup to activation.",
        "node_count": 18, "uses": 4700, "nodes": [], "edges": [],
    },
    {
        "name": "Employee Offboarding", "category": "HR", "icon": "🔐", "color": "#EF4444",
        "description": "Revoke access, archive data, and notify stakeholders automatically.",
        "node_count": 22, "uses": 1200, "nodes": [], "edges": [],
    },
]

INTEGRATIONS = [
    {"name": "Salesforce", "icon": "☁", "connected": True},
    {"name": "HubSpot", "icon": "🟠", "connected": True},
    {"name": "Slack", "icon": "💬", "connected": False},
    {"name": "Notion", "icon": "📝", "connected": True},
    {"name": "GitHub", "icon": "🐙", "connected": False},
    {"name": "Stripe", "icon": "💳", "connected": True},
]

PRICING_PLANS = [
    {
        "name": "Starter", "price_monthly": 25, "price_annual": 19, "is_custom": False,
        "description": "Perfect for solo builders and early-stage projects.",
        "features": ["5 active workflows", "1,000 runs/mo", "Basic AI nodes", "Email support", "Community templates"],
        "featured": False, "cta": "Start free trial",
    },
    {
        "name": "Pro", "price_monthly": 99, "price_annual": 79, "is_custom": False,
        "description": "For growing teams automating their core operations.",
        "features": [
            "Unlimited workflows", "50,000 runs/mo", "All AI nodes + GPT-4", "Priority support",
            "Custom templates", "Team collaboration", "Version history", "API access",
        ],
        "featured": True, "cta": "Start Pro trial",
    },
    {
        "name": "Enterprise", "price_monthly": None, "price_annual": None, "is_custom": True,
        "description": "For organizations with advanced security and scale needs.",
        "features": [
            "Unlimited everything", "SLA guarantee", "Dedicated support", "SSO & SAML",
            "On-premise option", "Custom integrations", "Audit logs", "White labeling",
        ],
        "featured": False, "cta": "Contact sales",
    },
]


def seed_if_empty(db: Session) -> None:
    if db.query(Template).count() == 0:
        db.bulk_save_objects([Template(**t) for t in TEMPLATES])
    if db.query(Integration).count() == 0:
        db.bulk_save_objects([Integration(**i) for i in INTEGRATIONS])
    if db.query(PricingPlan).count() == 0:
        db.bulk_save_objects([PricingPlan(**p) for p in PRICING_PLANS])
    db.commit()
